import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Subscription } from "./subscription.model";
import { SubscriptionService } from "./subscription.services";

// get blog by id
const addMailIntoBD = catchAsync(async (req, res) => {
  const result = await SubscriptionService.addMailIntoBD(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Add subscription successfully",
    data: result,
  });
});
const getAllSubscriptions = catchAsync(async (req, res) => {
  const query = req.query as any;
  const result = await SubscriptionService.getAllSubscriptions(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get all subscription successfully",
    data: result,
  });
});
const sendMailMultipleUser = catchAsync(async (req, res) => {

  const result = await SubscriptionService.sendMailMultipleUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "send mail successfully",
    data: result,
  });
});

export const subscriptionController = {
  addMailIntoBD,
  getAllSubscriptions,
  sendMailMultipleUser
};
