import {PhotoDocuments} from "../schemas/photo.schema";

export class PhotoCreateEvent {

    public static readonly eventName = 'photo.create';

    public constructor(
        public photo: PhotoDocuments
    ) {}
}
