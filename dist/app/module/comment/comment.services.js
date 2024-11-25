"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentServices = void 0;
const fileUploads_1 = require("../../helpers/fileUploads");
const comment_model_1 = require("./comment.model");
const blog_model_1 = require("../blog/blog.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createComment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.file;
    let payload = JSON.parse(req.body.data);
    const blog = yield blog_model_1.Blog.findById(payload.blog);
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Blog not found");
    }
    if (files) {
        const uploadImage = yield fileUploads_1.fileUploader.uploadToDigitalOcean(files);
        payload.image = (uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.Location) || "";
    }
    const result = yield comment_model_1.Comment.create(payload);
    return result;
});
const updateComment = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.file;
    const payload = JSON.parse(req.body.data);
    // Ensure the comment ID is provided
    const commentId = req.params.id;
    if (!commentId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Comment ID is required");
    }
    // Fetch the existing comment
    const comment = yield comment_model_1.Comment.findById(commentId);
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found");
    }
    // Check if the associated blog exists
    const blog = yield blog_model_1.Blog.findById(payload.blog);
    if (!blog) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Blog not found");
    }
    // Handle file upload if a new file is provided
    if (files) {
        const uploadImage = yield fileUploads_1.fileUploader.uploadToDigitalOcean(files);
        payload.image = (uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.Location) || comment.image; // Use the new image or retain the existing one
    }
    else {
        payload.image = comment.image; // Retain the existing image if no new file is uploaded
    }
    // Update the comment with the new payload
    Object.assign(comment, payload);
    yield comment.save();
    return comment;
});
// Get all comments with pagination
const getAllComments = (blogId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = query; // Default to page 1 and 10 comments per page
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // Fetch paginated comments for the given blog ID
    const comments = yield comment_model_1.Comment.find({ blog: blogId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
    // Count total comments for the given blog ID
    const totalComments = yield comment_model_1.Comment.countDocuments({ blog: blogId });
    return {
        totalComments,
        currentPage: Number(page),
        totalPages: Math.ceil(totalComments / limit),
        comments,
    };
});
exports.commentServices = {
    createComment,
    updateComment,
    getAllComments
};
