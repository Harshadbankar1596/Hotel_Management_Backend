import express from "express"
import UserAuthController from "../../controllers/UserControllers/userAuth.controller.js"

const router = express.Router()

router.post("/register" , UserAuthController.RegisterUser)
router.post("/login" , UserAuthController.LoginUser)

export default router