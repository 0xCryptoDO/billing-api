import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Transaction } from 'src/transaction/schemas';

export type BillDocument = Bill & Document;

@Schema()
export class Bill {
  @Prop({ unique: true, type: SchemaTypes.ObjectId })
  userId: Types.ObjectId;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Transaction' }],
  })
  transactions: Types.ObjectId[] | Transaction[];
}

export const BillSchema = SchemaFactory.createForClass(Bill);
