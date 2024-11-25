import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SupportService } from "./support.services";

const createSupport= catchAsync(async (req, res) => {
    const body=req.body
   const result=await SupportService.createSupport(body) 
    
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Your profile update successfully',
        data: result,
      });
    });

    export const supportController={
        createSupport
    }