// send support request

import express from "express";
import auth from "../../middlewares/auth";
import { supportController } from "./support.controller";
import { USER_ROLE } from "../../utils/constant";
const router = express.Router();

router.post(
  "/support-request",
  supportController.createSupport
);

// get all support

// router.get(
//   "/get-all-support",
//   auth(
//     USER_ROLE.admin,
//     USER_ROLE.superAdmin,
//     USER_ROLE.manager,
//     USER_ROLE.supporter
//   ),
//   supportController.getAllSupportRequest
// );

// //get single support

// router.get(
//   "/single-support/:id",
//   auth(
//     USER_ROLE.admin,
//     USER_ROLE.superAdmin,
//     USER_ROLE.manager,
//     USER_ROLE.supporter
//   ),
//   supportController.getSingleSupportRequest
// );

// // delete support

// router.delete(
//   "/delete-support/:id",
//   auth(
//     USER_ROLE.admin,
//     USER_ROLE.superAdmin,
//     USER_ROLE.manager,
//     USER_ROLE.supporter
//   ),
//   supportController.deleteSupportRequest
// );

// //update support and send mail notification

// router.patch(
//   "/update-support/:id",
//   auth(
//     USER_ROLE.admin,
//     USER_ROLE.superAdmin,
//     USER_ROLE.manager,
//     USER_ROLE.supporter
//   ),
//   supportController.updateSupportRequestAndSendNotification
// );
export const SupportRouter = router;
