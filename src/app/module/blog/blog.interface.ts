import { Types } from "mongoose";
export interface IBlog{
    id?: string;
    image: string;
    category: string;
    title: string;
    content: string;
    authorId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;

}