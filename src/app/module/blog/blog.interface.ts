import { Types } from "mongoose";
export interface IBlog{
    id?: string;
    banner: string;
    category: string;
    title: string;
    content: string;
    authorId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;

}