import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({timestamps: true})
export class Transaction {}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
