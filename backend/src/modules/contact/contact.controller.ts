import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactService } from './contact.service';
import { switchMap, tap } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactFormCreateEvent } from './events/contact-form-create.event';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {

    public constructor(
        private readonly contactService: ContactService,
        private readonly userService: UsersService,
        private readonly eventEmitter: EventEmitter2
        ) {
    }

    @ApiBody({type: CreateContactDto})
    @Post()
    public saveMessage(@Body() dto: CreateContactDto, @Req() request: Request) {

        const domain = request.headers.host;

        return this.userService.extractUserOrNullFromRequest(request).pipe(
            switchMap(userOrNull => this.contactService.saveMessage({...dto, domain }, userOrNull?._id)),
            tap(contact => this.eventEmitter.emit(ContactFormCreateEvent.eventName, new ContactFormCreateEvent(contact))),
        )
    }
}
