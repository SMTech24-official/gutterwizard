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
exports.BlogService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const blog_model_1 = require("./blog.model");
const fileUploads_1 = require("../../helpers/fileUploads");
const createBlog = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.file;
    let payload = JSON.parse(req.body.data);
    if (files) {
        const uploadImage = yield fileUploads_1.fileUploader.uploadToDigitalOcean(files);
        payload.banner = (uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.Location) || "";
    }
    payload.authorId = req.user.userId;
    const result = yield blog_model_1.Blog.create(payload);
    return result;
});
// Service to update a blog
const updateBlog = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.file;
    let payload = JSON.parse(req.body.data);
    if (files) {
        const uploadImage = yield fileUploads_1.fileUploader.uploadToDigitalOcean(files);
        payload.banner = (uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.Location) || "";
    }
    // Ensure the user ID is assigned to the payload
    payload.authorId = req.user.userId;
    // Extract the blog ID from the request (e.g., from params or body)
    const blogId = req.params.id || payload.id;
    if (!blogId) {
        throw new AppError_1.default(http_status_1.default.NOT_IMPLEMENTED, "Blog ID is required for updating.");
    }
    const result = yield blog_model_1.Blog.findByIdAndUpdate(blogId, payload, { new: true });
    return result;
});
// Get all blogs with pagination, category filtering, and case-insensitive search
const getAllBlogs = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, category } = query; // Default to page 1, 10 blogs per page, and no category filter
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // Build the filter object
    const filter = {};
    if (category) {
        // Use a case-insensitive regex for the category
        filter.category = { $regex: category, $options: "i" };
    }
    // Fetch paginated and filtered results
    const result = yield blog_model_1.Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)).populate('authorId', "-password -isVerified");
    // Count total documents matching the filter
    const totalBlogs = yield blog_model_1.Blog.countDocuments(filter);
    return {
        totalBlogs,
        currentPage: Number(page),
        totalPages: Math.ceil(totalBlogs / limit),
        blogs: result,
    };
});
// get blog by id
const getBlogById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.findById(id).populate('authorId', "-password -isVerified");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Blog not found");
    }
    return result;
});
exports.BlogService = {
    createBlog,
    updateBlog,
    getAllBlogs,
    getBlogById
};
