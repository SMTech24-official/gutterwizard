import mongoose, { Schema } from "mongoose";
import { IComment } from "./comment.interface";

const CommentSchema: Schema = new Schema(
    {
      content: { type: String, required: true },
      name: { type: String, required: true },
      blog: { type: Schema.Types.ObjectId, required: true },
      email: { type: String, required: true },
      website: { type: String, required: false },
      image: { type: String, required: false },
    },
    { timestamps: true } // Automatically manage `createdAt` and `updatedAt` fields
  );
  export const Comment= mongoose.model<IComment>('Comment', CommentSchema);