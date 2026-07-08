import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  response: string;
  language: 'ar' | 'en';
  timestamp: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
