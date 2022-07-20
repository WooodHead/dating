import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { User } from '../../users/decorators/user.decorator';
import { UsersDocuments } from '../../users/schemas/users.schema';
import { GetRoomsDto } from './dto/get-rooms.dto';
import { RoomConfig } from './schemas/chat-room.schema';
import { mapTo, switchMap } from 'rxjs';
import { ChatLinkDto } from '../dto/chatLink.dto';

@ApiTags('Room')
@Controller('chat-rooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ChatRoomsController {

    public constructor(
        private readonly roomService: ChatRoomsService
    ) {
    }

    @Get()
    @ApiQuery({type: GetRoomsDto})
    public getRooms(@User() user: UsersDocuments, @Query() params: GetRoomsDto) {
        return this.roomService.getAggregationRooms(
            user._id,
            params.isArchived,
            params.take,
            params.offset,
        );
    }

    @Patch(':chatLink')
    @ApiQuery({type: RoomConfig})
    public updateRoomConfig(@Param() params: ChatLinkDto, @User() user: UsersDocuments, @Body() dto: RoomConfig) {
        return this.roomService.findRoom({chatLink: params.chatLink, user: user._id}).pipe(
            switchMap(room => this.roomService.updateRoomConfig(room, dto)),
            mapTo({message: 'configs has been updated'})
        )
    }
}
