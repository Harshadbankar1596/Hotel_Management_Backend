import express from "express"
import UserAuthController from "../../controllers/UserControllers/userAuth.controller.js"
import VerifyUserRefreshToken from "../../middleware/VerifyUserRefreshToken.js"

const router = express.Router()

router.post("/register" , UserAuthController.RegisterUser)
router.post("/login" , UserAuthController.LoginUser)
router.post("/refresh" , VerifyUserRefreshToken , UserAuthController.Refresh)

export default router