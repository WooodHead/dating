import { IntersectionType } from '@nestjs/swagger';
import { MessagesIdDto } from './messagesId.dto';
import { ChatLinkDto } from '../../dto/chatLink.dto';

export class MarkAsReadMessagesDto extends IntersectionType(
    MessagesIdDto,
    ChatLinkDto
) {}
