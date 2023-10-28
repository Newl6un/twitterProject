import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayload } from '~/models/requests/User.request'
config()
//hàm nhận vào payload, privateKey, option từ đó ký tên
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  option = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
  option?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, option, (err, token) => {
      if (err) reject(err)
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) throw reject(err)
      resolve(decoded as TokenPayload)
    })
  })
}
