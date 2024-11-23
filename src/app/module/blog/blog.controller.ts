import { Body } from './../../../../node_modules/aws-sdk/clients/bedrockruntime.d';
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogService } from "./blog.services";

const createBlog= catchAsync(async (req, res) => {
   
   const result=await BlogService.createBlog(req.body)
    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Your profile update successfully',
        data: result,
      });
    });
const updateBlog= catchAsync(async (req, res) => {
   const id=req.params.id;
const data=req.body.data;
   const result=await BlogService.updateBlog(id, data);
    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Your profile update successfully',
        data: result,
      });
    });


   export const BlogController={
        createBlog,
        updateBlog
    }