import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'wallet';
  transactionId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    stripePaymentIntentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'wallet'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
