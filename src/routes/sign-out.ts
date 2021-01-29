import { Router } from "express"

const router = Router()

router.post("/api/users/sign-out", (req, res) => {
  req.session = null

  res.json({})
})

export { router as signOutRouter }
