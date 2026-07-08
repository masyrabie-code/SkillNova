import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'ar' | 'en' | 'both';
  price: number;
  isFree: boolean;
  image: string;
  thumbnail: string;
  videos: Array<{
    title: string;
    url: string;
    duration: number;
  }>;
  students: mongoose.Types.ObjectId[];
  rating: number;
  reviews: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    titleAr: {
      type: String,
      required: [true, 'عنوان الكورس مطلوب'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'digital-marketing',
        'programming',
        'ai',
        'design',
        'business',
        'web-development',
      ],
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: {
      type: String,
      enum: ['ar', 'en', 'both'],
      default: 'both',
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    image: String,
    thumbnail: String,
    videos: [
      {
        title: String,
        url: String,
        duration: Number,
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICourse>('Course', courseSchema);
