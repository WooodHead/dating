import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export type ProductDocument = Product & Document & SchemaTimestampsConfig;

@Schema({timestamps: true})

export class Product {

    @Prop({required: true, type: String})
    @ApiProperty({required: true, type: String})
    @Expose() name: string;

    @Prop({required: true, type: Number})
    @ApiProperty({required: true, type: Number})
    @Expose() dueDate: number;

    @Prop({type: Number, default: 0})
    @ApiProperty({type: Number, default: 0})
    @Expose() price: number = 0;

    @Prop({required: true, type: String})
    @ApiProperty({required: true, type: String, description: 'name of class-rule'})
    @Expose() rule: string;

    @Prop({required: true, type: String})
    @ApiProperty({required: true, type: String})
    @Expose() type: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
