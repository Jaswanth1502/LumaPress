import mongoose, { Schema, Document } from 'mongoose';
import { calculateReadingTime, slugify } from '../utils/helpers.js';

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: 'draft' | 'published';
  author: mongoose.Types.ObjectId;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      index: true,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Auto calculate reading time before saving
postSchema.pre<IPost>('save', function (next) {
  if (this.isModified('content')) {
    this.readingTime = calculateReadingTime(this.content);
  }
  next();
});

export const Post = mongoose.model<IPost>('Post', postSchema);
