import { Request, Response, NextFunction } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'
import { error } from 'console'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  //neu no vao duoc day tuc la no da dang nhap thanh cong
  //sever phai tao ra accessToken va refresh token de dua cho client
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

//export default loginController
