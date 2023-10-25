import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
//import loginController from '~/controllers/users.controllers'
//import loginValidator from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.get('/login', loginValidator, loginController)
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
usersRouter.post('/register', registerValidator, registerController)
export default usersRouter
