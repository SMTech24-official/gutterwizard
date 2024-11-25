import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { commentServices } from "./comment.services";

// get blog by id
const createComment = catchAsync(async (req, res) => {
  const result = await commentServices.createComment(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "create comment successfully",
    data: result,
  });
});
// get blog by id
const updateComment = catchAsync(async (req, res) => {
  const result = await commentServices.updateComment(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "updated comment successfully",
    data: result,
  });
});
const getAllComments = catchAsync(async (req, res) => {
  const id = req.params.id;
  const query = req.query;
  const result = await commentServices.getAllComments(id, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get all comment successfully",
    data: result,
  });
});

export const commentController = {
  createComment,
  updateComment,
  getAllComments,
};
