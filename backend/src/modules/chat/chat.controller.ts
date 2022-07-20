import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { MessagesService } from './messages/messages.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { User } from '../users/decorators/user.decorator';
import { UsersDocuments } from '../users/schemas/users.schema';
import { combineLatest, map, mapTo, of, switchMap, switchMapTo, tap, throwError } from 'rxjs';
import { GetMessagesDto } from './messages/dto/get-messages.dto';
import { UserProfileService } from '../users/user-profile/user-profile.service';
import { ChatRoomsService } from './chat-rooms/chat-rooms.service';
import { BlockUserGuard } from '../../guards/block-user.guard';
import { SendMessageDto } from './messages/dto/send-message.dto';
import { catchError } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatLinkDto } from './dto/chatLink.dto';
import { ChatDeleteEvent, MessageSendEvent, MessagesReadEvent, RoomCreateEvent } from './chat.event';
import { ChatService } from './chat.service';
import { MarkAsReadMessagesDto } from './messages/dto/mark-as-read-messages.dto';
import { ChatMessageDocuments } from './messages/schemas/chat-message.schema';
import { UsersRelationsService } from '../users/users-relations/users-relations.service';
import { ChatMessageLimitGuard } from '../../guards/triggers/chat-message-limit.guard';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {

    public constructor(
        private readonly messagesService: MessagesService,
        private readonly profileService: UserProfileService,
        private readonly roomService: ChatRoomsService,
        private readonly eventEmitter: EventEmitter2,
        private readonly chatService: ChatService,
        private readonly relationService: UsersRelationsService
    ) {
    }

    @UseGuards(JwtAuthGuard, BlockUserGuard, ChatMessageLimitGuard)
    @ApiBody({type: SendMessageDto})
    @ApiBearerAuth('JWT')
    @Post('send')
    public sendMessage(@User() user: UsersDocuments, @Body() dto: SendMessageDto) {

        if (String(user._id) == String(dto.targetUserId)) throw new HttpException('Same user', HttpStatus.BAD_REQUEST);

        return this.roomService.findRoom({user: user._id, toUser: dto.targetUserId}).pipe(
            catchError(e => (e instanceof HttpException)
                ? this.chatService.createNewChatRooms(user._id, dto.targetUserId).pipe(
                    tap(data => this.eventEmitter.emit(RoomCreateEvent.eventName, new RoomCreateEvent(data.authUserRoom))),
                    tap(data => this.eventEmitter.emit(RoomCreateEvent.eventName, new RoomCreateEvent(data.toUserRoom))),
                    map(data => data.authUserRoom)
                )
                : throwError(() => new HttpException(e, HttpStatus.BAD_REQUEST))
            ),
            switchMap(room => this.messagesService.searchAndReplaceForbiddenWords(dto.message).pipe(map(text => {
                return {text, room}
            }))),
            switchMap(data => this.messagesService.saveMessage(data.room, data.text).pipe(
                tap(message => this.eventEmitter.emit(MessageSendEvent.eventName, new MessageSendEvent(message))),
                map((message: ChatMessageDocuments) => {
                    return {
                        message_status: 'Send',
                        chatId: data.room.chatLink,
                        createdAt: message.createdAt,
                        isRead: message.isRead,
                        msgId: message._id
                    }

                })
            )),
        )
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiQuery({type: GetMessagesDto})
    @Get('messages-middle')
    public getMiddleMessages(@User() user: UsersDocuments, @Query() dto: GetMessagesDto) {
        return combineLatest({
            messages: this.messagesService.getMiddleMessages({
                authUserId: user._id,
                chatLink: dto.chatLink,
                limit: dto.take,
                offset: dto.offset
            }),
            room: this.roomService.findRoom({chatLink: dto.chatLink, user: user._id})
        }).pipe(
            switchMap(data => combineLatest({
                profile: this.profileService.findProfileByParam({user: data.room.toUser}, {
                    'user': 1,
                    'name': 1,
                    'avatarPath': 1,
                    'online': 1,
                }),
                roomConfig: of(data.room.config),
                relation: this.relationService.relationBothUsers(user._id, data.room.toUser)
            }).pipe(
                map(collection => {
                    return {...data.messages, ...collection}
                })
            ))
        )
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiQuery({type: GetMessagesDto})
    @Get('messages')
    public getMessages(@User() user: UsersDocuments, @Query() dto: GetMessagesDto) {
        return this.messagesService.getReadMessages(user._id, dto.chatLink, dto.offset, dto.take).pipe(
            map(data => data.reverse())
        );
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @ApiBearerAuth('JWT')
    @ApiBody({type: MarkAsReadMessagesDto})
    @Post('mark-as-read')
    public markMessageAsRead(@User() user: UsersDocuments, @Body() dto: MarkAsReadMessagesDto) {
        return this.messagesService.markAsReadMessage(dto.messagesIds, user._id, dto.chatLink).pipe(
            tap(msg => this.eventEmitter.emit(MessagesReadEvent.eventName, new MessagesReadEvent(msg)))
        );
    }

    @ApiBearerAuth('JWT')
    @UseGuards(JwtAuthGuard)
    @Delete(':chatLink')
    public deleteRoom(@Param() {chatLink}: ChatLinkDto, @User() user: UsersDocuments) {
        return this.roomService.findRoom({chatLink, user: user._id}).pipe(
            switchMap(room => this.messagesService.deleteMessagesByParams({chatLink}).pipe(
                switchMapTo(this.roomService.deleteRoomByParams({chatLink})),
                tap(() => this.eventEmitter.emit(ChatDeleteEvent.eventName, new ChatDeleteEvent(chatLink, room.toUser, user))),
            )),
            mapTo({message: 'chat has been deleted'}),
            catchError(() => throwError(() => new HttpException('chat doesn\'t delete', HttpStatus.UNPROCESSABLE_ENTITY)))
        )
    }
}
