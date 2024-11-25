import {Router}from "express"
import { subscriptionController } from "./subscription.controller"
import auth from "../../middlewares/auth"
import { USER_ROLE } from "../../utils/constant"


const router=Router()

router.post("/add-mail",subscriptionController.addMailIntoBD)

router.get("/",auth(USER_ROLE.admin),subscriptionController.getAllSubscriptions)
router.get("/send-mail",auth(USER_ROLE.admin),subscriptionController.sendMailMultipleUser)



export const SubscriptionRouter=router