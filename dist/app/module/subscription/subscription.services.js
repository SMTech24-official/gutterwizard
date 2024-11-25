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
exports.SubscriptionService = void 0;
const subscription_model_1 = require("./subscription.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendEmail_1 = require("../../utils/sendEmail");
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
const addMailIntoBD = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const email = yield subscription_model_1.Subscription.findOne({ email: payload.email });
    const isValidEmail = validateEmail(payload.email);
    if (!isValidEmail) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid email format");
    }
    if (email) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "this email is already in use");
    }
    const result = yield subscription_model_1.Subscription.create(payload);
    return result;
});
// get all subscriptions
const getAllSubscriptions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = query; // Default to page 1 and 10 subscriptions per page
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // Fetch paginated subscriptions
    const result = yield subscription_model_1.Subscription.find()
        .skip(skip) // Skip the documents based on the page
        .limit(Number(limit)) // Limit the number of documents returned
        .sort({ createdAt: -1 }); // Optionally, sort by creation date (or any other field)
    // Count the total number of subscriptions
    const totalSubscriptions = yield subscription_model_1.Subscription.countDocuments();
    return {
        totalSubscriptions,
        currentPage: Number(page),
        totalPages: Math.ceil(totalSubscriptions / limit),
        subscriptions: result,
    };
});
const sendMailMultipleUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const htmlContent = `
    <html>
      <body>
        <h1>${payload.subject}</h1>
        <p>${payload.text}</p>
        <p>Best regards,</p>
        <p>Gutter wizerd</p>
      </body>
    </html>
  `;
    yield (0, sendEmail_1.sendEmail)(payload.email, htmlContent, payload.subject);
});
exports.SubscriptionService = {
    addMailIntoBD,
    getAllSubscriptions,
    sendMailMultipleUser,
};
