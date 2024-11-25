"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRouter = void 0;
const express_1 = require("express");
const subscription_controller_1 = require("./subscription.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const router = (0, express_1.Router)();
router.post("/add-mail", subscription_controller_1.subscriptionController.addMailIntoBD);
router.get("/", (0, auth_1.default)(constant_1.USER_ROLE.admin), subscription_controller_1.subscriptionController.getAllSubscriptions);
router.get("/send-mail", (0, auth_1.default)(constant_1.USER_ROLE.admin), subscription_controller_1.subscriptionController.sendMailMultipleUser);
exports.SubscriptionRouter = router;
