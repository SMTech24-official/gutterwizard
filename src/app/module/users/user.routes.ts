import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../utils/constant";
import { fileUploader } from "../../helpers/fileUploads";

const router=Router()
router.post("/register", userController.createUser)
router.post("/make-admin", auth(USER_ROLE.admin),fileUploader.uploadSingle, userController.createAdmin)
router.patch("/update-profile", auth(USER_ROLE.admin,USER_ROLE.user,USER_ROLE.superAdmin),fileUploader.uploadSingle, userController.updateProfile)
router.put("/active-account",userController.activeAccount)


export const UserRoutes=router