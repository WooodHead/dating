import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Product } from '../product/product.schema';

export type PurchaseDocument = Purchase & Document;

@Schema({timestamps: true})
export class Purchase {

    @Prop({type: MSchema.Types.ObjectId, ref: 'User', immutable: true, required: true})
    @ApiProperty({type: {type: MSchema.Types.ObjectId, ref: 'User', required: true}})
    @Expose() user: Types.ObjectId;

    @Prop({type: Product, immutable: true, required: true})
    @ApiProperty({type: Product, required: true})
    @Expose() product: Product;

    // TODO: transaction
    @Prop({type: MSchema.Types.ObjectId, immutable: true, required: true})
    @ApiProperty({type: {type: MSchema.Types.ObjectId, required: true}})
    @Expose() transaction: Types.ObjectId;

    @Prop({type: Number, required: true})
    @ApiProperty({type: Number, required: true, description: 'unixtime in sec'})
    @Expose() startAt: number;

    @Prop({type: Number, required: true})
    @ApiProperty({type: Number, required: true, description: 'unixtime in sec'})
    @Expose() endAt: number;

    @Prop({type: Number, required: false})
    @ApiProperty({type: Number, required: false, description: 'unixtime in sec'})
    @Expose() autoPay: number | null;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
