"use strict";
// send support request
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const support_controller_1 = require("./support.controller");
const constant_1 = require("../../utils/constant");
const router = express_1.default.Router();
router.post("/support-request", support_controller_1.supportController.createSupport);
// get all support
router.get("/get-all-support", (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), support_controller_1.supportController.getAllSupportRequest);
//get single support
router.get("/single-support/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), support_controller_1.supportController.getSingleSupportRequest);
// delete support
router.delete("/delete-support/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), support_controller_1.supportController.deleteSupportRequest);
//update support and send mail notification
router.patch("/update-support/:id", (0, auth_1.default)(constant_1.USER_ROLE.admin, constant_1.USER_ROLE.superAdmin), support_controller_1.supportController.updateSupportRequestAndSendNotification);
exports.SupportRouter = router;
