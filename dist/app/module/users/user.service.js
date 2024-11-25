"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const argon2 = __importStar(require("argon2"));
const sendEmail_1 = require("../../utils/sendEmail");
const fileUploads_1 = require("../../helpers/fileUploads");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.password = yield argon2.hash(payload.password);
    // Generate a 6-digit OTP
    const result = yield user_model_1.User.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "User create failed");
    }
    const _a = result.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.data) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Missing required data');
    }
    let payload = JSON.parse(req.body.data);
    const files = req.file;
    const plainPass = payload.password;
    payload.password = yield argon2.hash(payload.password);
    payload.role = "admin";
    payload.isVerified = true;
    if (files) {
        const uploadImage = yield fileUploads_1.fileUploader.uploadToDigitalOcean(files);
        payload.profileImage = (uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.Location) || "";
    }
    const result = yield user_model_1.User.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Admin create failed");
    }
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 20px auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      animation: fadeIn 1.5s ease-out;
    }
    .email-header {
      background-color: #007bff;
      color: #ffffff;
      padding: 15px 20px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    .email-body {
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .email-footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      padding: 10px 20px;
      border-top: 1px solid #ddd;
    }
    .highlight {
      color: #007bff;
      font-weight: bold;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .cta-button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 15px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .cta-button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Welcome to Admin Dashboard!
    </div>
    <div class="email-body">
      <p>Dear Admin,</p>
      <p>Congratulations! You are now an administrator for our platform. Below are your login credentials:</p>
      <p>Email: <span class="highlight">${payload.email}</span></p>
      <p>Password: <span class="highlight">${plainPass}</span></p>
    </div>
    <div class="email-footer">
      If you have any issues, feel free to contact our support team. <br>
      &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
    yield (0, sendEmail_1.sendEmail)(result.email, html, "Your Admin Credentials");
    const _a = result.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const activeAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: id });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not Found");
    }
    if (user === null || user === void 0 ? void 0 : user.isVerified) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "You account is already activated");
    }
    yield user_model_1.User.findOneAndUpdate({ _id: id }, { isActive: true });
    return { message: "Your account active successfully" };
});
const updateProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.data) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Missing required data');
    }
    let payload = JSON.parse(req.body.data);
    const files = req.file;
    // If the password is included in the request, hash it
    if (payload.password) {
        const plainPass = payload.password;
        payload.password = yield argon2.hash(payload.password);
    }
    // If a new profile image is uploaded, handle the file upload
    if (files) {
        const uploadImage = yield fileUploads_1.fileUploader.uploadToDigitalOcean(files);
        payload.profileImage = (uploadImage === null || uploadImage === void 0 ? void 0 : uploadImage.Location) || "";
    }
    // Assuming `User` is the model representing the logged-in user
    const userId = req.user.userId; // Get the current user's ID from the request (for example, from JWT token)
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    let updateDoc = {};
    if (payload.username) {
        updateDoc.username = payload.username;
    }
    // if(payload.email){
    //   updateDoc.email=payload.email
    // }
    if (payload.password) {
        updateDoc.password = payload.password;
    }
    if (payload.profileImage) {
        updateDoc.profileImage = payload.profileImage;
    }
    if (payload.fullName) {
        updateDoc.fullName = payload.fullName;
    }
    // Update the user's profile with the new data
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, updateDoc, { new: true });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Profile update failed');
    }
    // Return updated user data excluding the password
    const _a = updatedUser.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
exports.userServices = {
    createUser,
    activeAccount,
    createAdmin,
    updateProfile
};
