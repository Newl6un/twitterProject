//ta sẽ làm chức năng đăng nhập ./login
//thì khi mà đăng nhập, thì client truy cập /login
//tạo ra 1 req, và bỏ vào trong đó email, password
//nhét email, password vào trong req.body

import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing email or password'
    })
  }
  next()
}

//export default loginValidator
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const isExist = await usersService.checkEmailExist(value)
          if (isExist) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true
        }
      },
      errorMessage:
        'Password must be at least 8 characters long, contain at least 1 lowercase, contain at least 1 uppercase, contain at least 1 number, contain at least 1 symbol'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true
        }
      },
      errorMessage:
        'confirm_password must be at least 8 characters long, contain at least 1 lowercase, contain at least 1 uppercase, contain at least 1 number, contain at least 1 symbol',
      custom: {
        options: (value, { req }) => {
          if (value != req.body.password) {
            throw new Error('confirm_password does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
