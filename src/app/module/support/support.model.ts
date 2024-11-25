import mongoose, { Schema } from "mongoose";
import { ISupports } from "./support.interface";

const SupportSchema: Schema = new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
      phone: { type: String, required: true },
      status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending",
  
    },
      message: { type: String, required: true },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
  );
  
  // Export the Mongoose model
  export const Support = mongoose.model<ISupports>('Support', SupportSchema);
  
