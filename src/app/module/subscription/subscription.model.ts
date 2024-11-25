import mongoose, { Schema } from "mongoose";
import { ISubscription } from "./subscription.interface";

const SubscriptionSchema = new Schema<ISubscription>(
  {
    email: { type: String, required: true,unique: true },
    
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
