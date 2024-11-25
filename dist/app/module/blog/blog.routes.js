"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const blog_controller_1 = require("./blog.controller");
const fileUploads_1 = require("../../helpers/fileUploads");
const router = (0, express_1.Router)();
// Route for creating a blog
router.post('/create', (0, auth_1.default)(constant_1.USER_ROLE.admin), fileUploads_1.fileUploader.uploadSingle, blog_controller_1.BlogController.createBlog);
// Route for updating a blog
router.put('/update/:id', (0, auth_1.default)(constant_1.USER_ROLE.admin), fileUploads_1.fileUploader.uploadSingle, blog_controller_1.BlogController.updateBlog);
//get all blog
router.get('/', blog_controller_1.BlogController.getAllBlogs);
// get blog by id 
router.get('/:id', blog_controller_1.BlogController.getBlogById);
exports.BlogRouter = router;
