import mongoose, {  Schema } from 'mongoose';
import { IBlog } from './blog.interface';



const blogSchema = new Schema<IBlog>(
  {
    banner: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming there is a User model
      required: true,
    },
   
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);


