import { Router } from 'express';
import { PostRoutes } from '../modules/posts/posts.route';
import { UserRoutes } from '../modules/user/user.route';
import { VoteRoutes } from '../modules/vote/vote.route';
import { AuthRoutes } from '../modules/auth/auth.route';



const router = Router();


const moduleRoutes = [
  {
    path:'/auth',
    route:AuthRoutes,
  },
  {
    path: '/posts',
    route:PostRoutes ,
  },
  {
    path: '/users',
    route:UserRoutes ,
  },
  {
    path: '/votes',
    route:VoteRoutes ,
  },
  
  
  
  
  
];

// Use each route in the application
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
