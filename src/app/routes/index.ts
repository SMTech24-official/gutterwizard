import { Router  } from "express";
import { UserRoutes } from "../module/users/user.routes";
import { AuthRoutes } from "../module/auth/auth.route";
import { BlogRouter } from "../module/blog/blog.routes";
import { commentRouter } from "../module/comment/comment.routes";
import { SubscriptionRouter } from "../module/subscription/subscription.route";
import { SupportRouter } from "../module/support/support.routes";
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
    {   path: '/comment',
        route: commentRouter
    },
    {   path: '/subScriptions',
        route: SubscriptionRouter
    },
    {   path: '/support',
        route: SupportRouter
    },

]

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;