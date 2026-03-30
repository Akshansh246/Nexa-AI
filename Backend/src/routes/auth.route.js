import express from 'express';
import { registerController, verifyEmailController, loginController, getMeController, logoutController } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../validations/auth.validation.js';
import { IdentifyUser } from '../middlewares/auth.middleware.js';

const authRouter = express.Router()


/**
 * @route /api/auth/register
 * @description Register a new user
 * @access public
 * @body {username, email, password}
 */
authRouter.post('/register', registerValidation, registerController)

/**
 * @route /api/auth/login
 * @description Logins a user
 * @access public
 * @body {email, password}
 */
authRouter.post('/login', loginValidation, loginController)

/**
 * @route /api/auth/get-me
 * @description Returns the details of logged in user
 * @access private
 */
authRouter.get('/get-me', IdentifyUser, getMeController)

/**
 * @route /api/auth/verify-email
 * @description Verify user's email
 * @access public
 * @query { token }
 */
authRouter.get('/verify-email', verifyEmailController)

/**
 * @route /api/auth/logout
 * @description Logs out the user by clearing the cookie
 * @access private
 */
authRouter.post('/logout', logoutController) 

export default authRouter