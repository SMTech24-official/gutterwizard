import { Router  } from "express";
import { UserRoutes } from "../module/users/user.routes";
import { AuthRoutes } from "../module/auth/auth.route";
import { BlogRouter } from "../module/blog/blog.routes";
;

const router = Router();
const moduleRoutes=[
    {   path: '/users',
        route: UserRoutes
    },
    {   path: '/auth',
        route: AuthRoutes
    },
    {   path: '/blog',
        route: BlogRouter
    },

]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;