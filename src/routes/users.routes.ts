import { error } from 'console'
import { Router } from 'express'
import { access } from 'fs'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
//import loginController from '~/controllers/users.controllers'
//import loginValidator from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.get('/login', loginValidator, wrapAsync(loginController))
// Register new user
//path /register
//method: POST
/*
    body:{
        name: string
        email: string
        password: string
        confirm_Password: string
        date_of_birth: string theo chuan ISO 8601
    }
*/
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/**
 * des: verify email
 * method: post
 * path: /users/verify-email
 * body: {
 *  email_verify_token: string
 * }
 */

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))

/**
 * des: resend verify email
 * method: post
 * path: /users/resend-verify-email
 * headers: {Authorization: "Bearer access_token"}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/**
 * des: forgot password
 * method: post
 * path: /users/forgot-password
 * body:{
 *  email: string
 * }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
  des: verify forgot password
  method: post
  path: /users/verify-forgot-password
  body: {
    forgot_password_token: string
  }
*/
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
export default usersRouter
