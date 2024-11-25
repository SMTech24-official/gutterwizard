import {Types} from "mongoose"
export interface IComment{
    id?: string;
    content: string;
    name:string;
    blog: Types.ObjectId;
    email:string;
    website:string;
    image:string;
}