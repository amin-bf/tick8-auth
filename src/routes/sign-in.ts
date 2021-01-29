import { Router, Request, Response } from "express"
import { body } from "express-validator"
import jwt from "jsonwebtoken"
import dotEnv from "dotenv"
import { RequestValidationError, validateRequest } from "@vanguardo/common"

import { User, IUserDoc } from "../models/user"
import { Password } from "../services/password"

dotEnv.config()
const router = Router()

router.post(
  "/api/users/sign-in",
  [
    body("email").isEmail().withMessage("No valid email"),
    body("password").trim().notEmpty().withMessage("Password is mandatory")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser: IUserDoc = await User.findOne({ email })
    if (!existingUser)
      throw new RequestValidationError([
        {
          param: "auth",
          msg: "Bad Credentials",
          value: "",
          location: "body"
        }
      ])

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    )

    if (!passwordMatch)
      throw new RequestValidationError([
        {
          param: "auth",
          msg: "Bad Credentials",
          value: "",
          location: "body"
        }
      ])

    // Generate JWT
    const userJWT = jwt.sign(existingUser.toJSON(), process.env.JWT_SECRET!)

    // Store JWT on session
    req.session!.jwt = userJWT

    res.json(existingUser)
  }
)

export { router as signInRouter }
