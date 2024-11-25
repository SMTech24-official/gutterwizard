import { Body } from './../../../../node_modules/aws-sdk/clients/bedrockruntime.d';
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogService } from "./blog.services";

const createBlog= catchAsync(async (req, res) => {
   
   const result=await BlogService.createBlog(req)
    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'create blog successfully',
        data: result,
      });
    });
const updateBlog= catchAsync(async (req, res) => {

   const result=await BlogService.updateBlog(req);
    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Your profile update successfully',
        data: result,
      });
    });
const getAllBlogs= catchAsync(async (req, res) => {
const query=req.query as any
   const result=await BlogService.getAllBlogs(query);
    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'get all blog successfully',
        data: result,
      });
    });
// get blog by id
    const getBlogById= catchAsync(async (req, res) => {
const id=req.params.id;
   const result=await BlogService.getBlogById(id);
    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'get blog by id successfully',
        data: result,
      });
    });

   export const BlogController={
        createBlog,
        updateBlog,
        getAllBlogs,
        getBlogById
    }