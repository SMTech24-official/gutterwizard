import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";

 const createBlog = async (data: IBlog): Promise<IBlog> => {
  try {
    const blog = new Blog(data);
    await blog.save();
    return blog;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Blog creation failed');
  }
};

// Service to update a blog
 const updateBlog = async (id: string, data: Partial<IBlog>): Promise<IBlog | null> => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true });
    if (!updatedBlog) {
      throw new AppError(httpStatus.NOT_FOUND,'Blog not found');
    }
    return updatedBlog;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Blog update failed');
  }
};
export const BlogService ={
    createBlog,
    updateBlog,
}