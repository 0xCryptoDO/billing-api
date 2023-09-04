import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Document, SchemaTypes } from 'mongoose';
import {
  TransactionStatus,
  IBillingTransaction,
  Currencies,
} from '@cryptodo/contracts';
import { Network } from '@cryptodo/contracts';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction implements IBillingTransaction {
  @Prop({ required: true, type: SchemaTypes.Number })
  payableAmount: number;

  @Prop({
    required: true,
    enum: Object.keys(Currencies),
    type: SchemaTypes.String,
  })
  currency: Currencies;

  @Prop({
    required: true,
    enum: Object.keys(Network),
    type: SchemaTypes.String,
  })
  network: Network;

  @Prop({ required: true, unique: true, type: SchemaTypes.ObjectId })
  contractId: string;

  @Prop({
    required: false,
    unique: true,
    sparse: true,
    type: SchemaTypes.String,
  })
  hash?: string;

  @Prop({
    required: true,
    enum: TransactionStatus,
    default: TransactionStatus.waitingForPayment,
    type: SchemaTypes.String,
  })
  status: TransactionStatus;

  @Prop({ required: false, unique: true, sparse: true, type: Object })
  receipt?: ethers.providers.TransactionReceipt;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
