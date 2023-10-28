//ta sẽ làm chức năng đăng nhập ./login
//thì khi mà đăng nhập, thì client truy cập /login
//tạo ra 1 req, và bỏ vào trong đó email, password
//nhét email, password vào trong req.body

import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          //tim user nao co email va password giong client dua
          const user = await databaseService.users.findOne({
            email: value,
            password: hashPassword(req.body.password)
          })
          if (user === null) {
            throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
          }
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
      }
    }
  })
)

//export default loginValidator
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      }
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await usersService.checkEmailExist(value)
          if (isExistEmail) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: false
          // false : chỉ return true nếu password mạnh, false nếu k
          // true : return về chất lượng password(trên thang điểm 10)
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
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
        },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
      }
    }
  })
)
// export const registerValidator = validate(
//   checkSchema({
//     name: {
//       notEmpty: true,
//       isString: true,
//       trim: true,
//       isLength: {
//         options: {
//           min: 1,
//           max: 100
//         }
//       }
//     },
//     email: {
//       notEmpty: true,
//       isEmail: true,
//       trim: true,
//       custom: {
//         options: async (value, { req }) => {
//           const isExist = await usersService.checkEmailExist(value)
//           if (isExist) {
//             throw new Error('Email already exists')
//           }
//           return true
//         }
//       }
//     },
//     password: {
//       notEmpty: true,
//       isString: true,
//       isLength: {
//         options: {
//           min: 8,
//           max: 50
//         }
//       },
//       isStrongPassword: {
//         options: {
//           minLength: 8,
//           minLowercase: 1,
//           minUppercase: 1,
//           minNumbers: 1,
//           minSymbols: 1
//           // returnScore: true
//         }
//       },
//       errorMessage:
//         'Password must be at least 8 characters long, contain at least 1 lowercase, contain at least 1 uppercase, contain at least 1 number, contain at least 1 symbol'
//     },
//     confirm_password: {
//       notEmpty: true,
//       isString: true,
//       isLength: {
//         options: {
//           min: 8,
//           max: 50
//         }
//       },
//       isStrongPassword: {
//         options: {
//           minLength: 8,
//           minLowercase: 1,
//           minUppercase: 1,
//           minNumbers: 1,
//           minSymbols: 1
//           // returnScore: true
//         }
//       },
//       errorMessage:
//         'confirm_password must be at least 8 characters long, contain at least 1 lowercase, contain at least 1 uppercase, contain at least 1 number, contain at least 1 symbol',
//       custom: {
//         options: (value, { req }) => {
//           if (value != req.body.password) {
//             throw new Error('confirm_password does not match password')
//           }
//           return true
//         }
//       }
//     },
//     date_of_birth: {
//       isISO8601: {
//         options: {
//           strict: true,
//           strictSeparator: true
//         }
//       }
//     }
//   })
// )
