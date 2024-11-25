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
exports.SupportService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const support_model_1 = require("./support.model");
const createSupport = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield support_model_1.Support.create(payload);
    return response;
});
const getAllSupportRequests = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, query) {
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (query.status) {
        baseQuery.status = query.status;
    }
    const supportRequests = yield support_model_1.Support.find(baseQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    return supportRequests;
});
const getSingleSupportRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const supportRequest = yield support_model_1.Support.findById(id);
    if (!supportRequest) {
        throw new Error("Support request not found");
    }
    return supportRequest;
});
// delete support
const deleteSupportRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const supportRequest = yield support_model_1.Support.findByIdAndDelete(id);
    if (!supportRequest) {
        throw new Error("Support request not found");
    }
    return supportRequest;
});
// update support and send mail notification
const updateSupportRequestAndSendNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const support = yield support_model_1.Support.findById(id);
    if (!support) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Support not found");
    }
    const supportRequest = yield support_model_1.Support.findByIdAndUpdate(id, { status: "resolved" }, // change status to resolved
    { new: true });
    if (!supportRequest) {
        throw new Error("Support request not found");
    }
    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Support Request Resolved</h2>
      <p>Dear ${support.email || "User"},</p>
      <p>We are pleased to inform you that your support request has been resolved. Our team has carefully reviewed your issue, and we hope that the resolution meets your expectations.</p>
      <p>If you have any further questions or need additional assistance, please don't hesitate to reply to this email or contact our support team.</p>
      <p>Thank you for reaching out to us, and we appreciate your patience.</p>
      <hr />
      <p style="color: #555;">Best regards,</p>
      <p style="color: #555;">The Support Team</p>
      <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply directly to this email.</p>
    </div>
  `;
    // send email notification
    (0, sendEmail_1.sendEmail)(support === null || support === void 0 ? void 0 : support.email, html, "Your Support Request Has Been Resolved");
    return supportRequest;
});
exports.SupportService = {
    createSupport,
    getAllSupportRequests,
    getSingleSupportRequest,
    deleteSupportRequest,
    updateSupportRequestAndSendNotification
};
