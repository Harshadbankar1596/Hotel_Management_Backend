import express from "express"
import UserAuthController from "../../controllers/UserControllers/userAuth.controller.js"
import VerifyUserRefreshToken from "../../middleware/VerifyUserRefreshToken.js"
import AdminOrSuperAdminAuth from "../../middleware/AdminOrSuperAdmin.middleware.js"

const router = express.Router()

router.post("/register" , AdminOrSuperAdminAuth , UserAuthController.RegisterUser)
router.post("/send-otp" , UserAuthController.SendOtp)
router.post("/login" , UserAuthController.LoginUser)
router.post("/refresh" , VerifyUserRefreshToken , UserAuthController.Refresh)

export default router