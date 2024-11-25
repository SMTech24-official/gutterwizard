import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";
import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploads";

 const createBlog = async (req:Request)=> {
  const files=req.file as any
  let payload=JSON.parse(req.body.data);
  if(files){
    const uploadImage=await fileUploader.uploadToDigitalOcean(files)
  payload.banner=uploadImage?.Location||""
}
payload.authorId=req.user.userId
const result=await Blog.create(payload)
return result
};

// Service to update a blog
 const updateBlog = async (req:Request) => {
  const files = req.file as any;
  let payload = JSON.parse(req.body.data);
  
  if (files) {
    const uploadImage = await fileUploader.uploadToDigitalOcean(files);
    payload.banner = uploadImage?.Location || "";
  }
  
  // Ensure the user ID is assigned to the payload
  payload.authorId = req.user.userId;
  
  // Extract the blog ID from the request (e.g., from params or body)
  const blogId = req.params.id || payload.id;
  
  if (!blogId) {
   throw new AppError(httpStatus.NOT_IMPLEMENTED,"Blog ID is required for updating.")
  }
  const result = await Blog.findByIdAndUpdate(blogId, payload, { new: true });
  return result;
};
// Get all blogs with pagination, category filtering, and case-insensitive search
const getAllBlogs = async (query: any) => {
  const { page = 1, limit = 10, category } = query; // Default to page 1, 10 blogs per page, and no category filter

  // Calculate the number of documents to skip
  const skip = (page - 1) * limit;

  // Build the filter object
  const filter: any = {};
  if (category) {
    // Use a case-insensitive regex for the category
    filter.category = { $regex: category, $options: "i" };
  }

  // Fetch paginated and filtered results
  const result = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit)).populate('authorId',"-password -isVerified");

  // Count total documents matching the filter
  const totalBlogs = await Blog.countDocuments(filter);

  return {
    totalBlogs,
    currentPage: Number(page),
    totalPages: Math.ceil(totalBlogs / limit),
    blogs: result,
  };
};


// get blog by id
 const getBlogById = async (id: string) => {
  const result = await Blog.findById(id).populate('authorId',"-password -isVerified");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Blog not found");
  }
  return result;
};
export const BlogService ={
    createBlog,
    updateBlog,
    getAllBlogs,
    getBlogById
}