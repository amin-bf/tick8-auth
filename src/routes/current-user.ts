import { Router } from "express"
import { currentUser } from "@vanguardo/common"

const router = Router()

router.get("/api/users/current-user", currentUser, (req, res) => {
  res.json({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }
