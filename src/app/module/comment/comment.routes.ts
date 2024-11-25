import {Router} from"express"
import { fileUploader } from "../../helpers/fileUploads"
import { commentController } from "./comment.controller"
const router=Router()

router.post("/create",fileUploader.uploadSingle,commentController.createComment)
router.put("/update/:id",fileUploader.uploadSingle,commentController.updateComment)
router.get("/:id",commentController.getAllComments)








export const commentRouter=router