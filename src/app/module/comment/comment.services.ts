import { Request } from "express"
import { fileUploader } from "../../helpers/fileUploads";
import { Comment } from "./comment.model";
import { Blog } from "../blog/blog.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createComment=async(req:Request)=>{
    const files=req.file as any
    let payload=JSON.parse(req.body.data);
    const blog=await Blog.findById(payload.blog)
    if(!blog){
        throw new AppError(httpStatus.BAD_REQUEST, "Blog not found")
    }
    if(files){
      const uploadImage=await fileUploader.uploadToDigitalOcean(files)
    payload.image=uploadImage?.Location||""
  }
  const result=await Comment.create(payload)
  return result
}

const updateComment = async (req: Request) => {
    const files = req.file as any;
    const payload = JSON.parse(req.body.data);
  
    // Ensure the comment ID is provided
    const commentId = req.params.id;
    if (!commentId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Comment ID is required");
    }
  
    // Fetch the existing comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }
  
    // Check if the associated blog exists
    const blog = await Blog.findById(payload.blog);
    if (!blog) {
      throw new AppError(httpStatus.BAD_REQUEST, "Blog not found");
    }
  
    // Handle file upload if a new file is provided
    if (files) {
      const uploadImage = await fileUploader.uploadToDigitalOcean(files);
      payload.image = uploadImage?.Location || comment.image; // Use the new image or retain the existing one
    } else {
      payload.image = comment.image; // Retain the existing image if no new file is uploaded
    }
  
    // Update the comment with the new payload
    Object.assign(comment, payload);
    await comment.save();
  
    return comment;
  };
  
// Get all comments with pagination
const getAllComments = async (blogId: string, query: any) => {
    const { page = 1, limit = 10 } = query; // Default to page 1 and 10 comments per page
  
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
  
    // Fetch paginated comments for the given blog ID
    const comments = await Comment.find({ blog: blogId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
  
    // Count total comments for the given blog ID
    const totalComments = await Comment.countDocuments({ blog: blogId });
  
    return {
      totalComments,
      currentPage: Number(page),
      totalPages: Math.ceil(totalComments / limit),
      comments,
    };
  };
  
export const commentServices={
    createComment,
    updateComment,
    getAllComments
}