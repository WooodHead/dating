import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AlbumSharePermissionDocuments = AlbumSharePermission & Document;

@Schema({timestamps: true})
export class AlbumSharePermission {

    @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    userId: Types.ObjectId;

    @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'User', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    targetUserId: Types.ObjectId;

    @Prop({required: true, type: MSchema.Types.ObjectId, ref: 'Album', immutable: true})
    @ApiProperty({type: MSchema.Types.ObjectId})
    albumId: Types.ObjectId
}

export const AlbumSharePermissionSchema = SchemaFactory.createForClass(AlbumSharePermission);
AlbumSharePermissionSchema.index({targetUserId: 1, albumId: 1}, { unique: true })
