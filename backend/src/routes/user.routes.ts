import { Hono } from 'hono';
import * as userController from "../controller/user.controller.js";
import { authMiddleware } from '../middleware/auth.middleware.js';

const userRoutes = new Hono();

userRoutes.post('/login', userController.handleLogin);
userRoutes.post('/signup', userController.handleSignup);
userRoutes.post('/logout', authMiddleware, userController.handleLogout);
userRoutes.get('/me', authMiddleware, userController.getMe);

export default userRoutes;
