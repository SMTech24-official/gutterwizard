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
    
      //get all support with pagination
  const getAllSupportRequest = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const query = req.query
    const result = await SupportService.getAllSupportRequests(page, limit,query);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get all support request success",
      data: result.supportRequests,
      meta:result.meta
    
    });
  });

  
  // get single support
  const getSingleSupportRequest = catchAsync(async (req, res) => {
    const result = await SupportService.getSingleSupportRequest(req.params.id);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get single support request success",
      data: result,
    });
  });
  
  
  // delete support
  const deleteSupportRequest = catchAsync(async (req, res) => {
    const result = await SupportService.deleteSupportRequest(req.params.id);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "delete support request success",
      data: result,
    });
  });


  
// update support and send mail notification
const updateSupportRequestAndSendNotification = catchAsync(async (req, res) => {
    const result = await SupportService.updateSupportRequestAndSendNotification(req.params.id);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "update support request success",
      data: result,
    });
  });
    export const supportController={
        createSupport,
        getAllSupportRequest,
        getSingleSupportRequest,
        deleteSupportRequest,
        updateSupportRequestAndSendNotification
    }