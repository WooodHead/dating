import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { Contact, ContactDocuments } from './schemas/contact.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ContactService {

    public constructor(
        @InjectModel(Contact.name) private readonly contactModel: Model<ContactDocuments>
    ) {}

    public saveMessage(contact: Contact, userId: Types.ObjectId): Observable<ContactDocuments> {
        return from(this.contactModel.create((userId) ? {...contact, user: userId} : contact));
    }
}
