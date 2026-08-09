import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post reference is required'],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author reference is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
