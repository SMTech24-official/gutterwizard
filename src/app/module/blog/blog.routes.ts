import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../../utils/constant';
import { BlogController } from './blog.controller';


const router = Router();

// Route for creating a blog
router.post('/create',auth(USER_ROLE.admin),BlogController.createBlog );

// Route for updating a blog
router.put('/update/:id', );

export const BlogRouter= router;