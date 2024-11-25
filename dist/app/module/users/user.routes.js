"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const fileUploads_1 = require("../../helpers/fileUploads");
const router = (0, express_1.Router)();
router.post("/register", user_controller_1.userController.createUser);
router.post("/make-admin", (0, auth_1.default)(constant_1.USER_ROLE.admin), fileUploads_1.fileUploader.uploadSingle, user_controller_1.userController.createAdmin);
router.patch("/update-profile", (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.user, constant_1.USER_ROLE.superAdmin), fileUploads_1.fileUploader.uploadSingle, user_controller_1.userController.updateProfile);
router.put("/active-account", user_controller_1.userController.activeAccount);
exports.UserRoutes = router;
