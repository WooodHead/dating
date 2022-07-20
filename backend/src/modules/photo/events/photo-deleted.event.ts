import {PhotoDocuments} from "../schemas/photo.schema";

export class PhotoDeletedEvent {

    public static readonly eventName = 'photo.deleted';

    public constructor(
        public photo: PhotoDocuments
    ) {}
}
