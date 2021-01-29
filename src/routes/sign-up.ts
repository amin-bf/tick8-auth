import { Router, Request, Response } from "express"
import { body } from "express-validator"
import jwt from "jsonwebtoken"
import dotEnv from "dotenv"
import { RequestValidationError, validateRequest } from "@vanguardo/common"

import { User } from "../models/user"

dotEnv.config()
const router = Router()

router.post(
  "/api/users/sign-up",
  [
    body("email").isEmail().withMessage("No valid email"),
    body("password")
      .trim()
      .isLength({ max: 20, min: 4 })
      .withMessage("Password must be between 4 to 20 chars")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser)
      throw new RequestValidationError([
        {
          param: "email",
          msg: "E-Mail already taken",
          value: "",
          location: "body"
        }
      ])

    const user = User.build({
      email,
      password
    })

    await user.save()

    // Generate JWT
    const userJWT = jwt.sign(user.toJSON(), process.env.JWT_SECRET!)

    // Store JWT on session
    req.session!.jwt = userJWT

    res.status(201).json(user)
  }
)

export { router as signUpRouter }
