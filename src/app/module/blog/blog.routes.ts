import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../utils/constant';
import { BlogController } from './blog.controller';
import { fileUploader } from '../../helpers/fileUploads';


const router = Router();

// Route for creating a blog
router.post('/create',auth(USER_ROLE.admin),fileUploader.uploadSingle, BlogController.createBlog );

// Route for updating a blog
router.put('/update/:id',auth(USER_ROLE.admin), fileUploader.uploadSingle, BlogController.updateBlog);
//get all blog
router.get('/', BlogController.getAllBlogs);
// get blog by id 

router.get('/:id', BlogController.getBlogById);
export const BlogRouter= router;