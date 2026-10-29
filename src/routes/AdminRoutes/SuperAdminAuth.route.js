import express from "express"
import SuperAdminAuthController from "../../controllers/AdminControllers/SuperAdminAuth.controller.js"
import VerifyRefreshTokenMiddleware from "../../middleware/VerifyRefreshToken.js"

const SuperAdminAuthRoute = express.Router()

SuperAdminAuthRoute.post("/register" , SuperAdminAuthController.Register)
SuperAdminAuthRoute.post("/login" , SuperAdminAuthController.Login)
SuperAdminAuthRoute.post("/refresh" ,VerifyRefreshTokenMiddleware , SuperAdminAuthController.Refresh)


export default SuperAdminAuthRoute