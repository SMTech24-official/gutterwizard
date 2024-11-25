"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../module/users/user.routes");
const auth_route_1 = require("../module/auth/auth.route");
const blog_routes_1 = require("../module/blog/blog.routes");
const comment_routes_1 = require("../module/comment/comment.routes");
const subscription_route_1 = require("../module/subscription/subscription.route");
const support_routes_1 = require("../module/support/support.routes");
;
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/users',
        route: user_routes_1.UserRoutes
    },
    { path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    { path: '/blog',
        route: blog_routes_1.BlogRouter
    },
    { path: '/comment',
        route: comment_routes_1.commentRouter
    },
    { path: '/subScriptions',
        route: subscription_route_1.SubscriptionRouter
    },
    { path: '/support',
        route: support_routes_1.SupportRouter
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
