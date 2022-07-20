import {ContactDocuments} from "../schemas/contact.schema";

export class ContactFormCreateEvent {

    public static readonly eventName = 'contact-form.create';

    public constructor(public contact: ContactDocuments) {}
}
