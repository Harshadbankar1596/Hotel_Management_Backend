import express from "express"
import HotelAuthController from "../../controllers/HotelControllers/HotelAuth.controller.js"
import SuperAdminAuth from "../../middleware/SuperAdminMiddleware.js"
import upload from "../../middleware/upload.middleware.js"

const HotelRoute = express.Router()

HotelRoute.post("/create" , SuperAdminAuth ,upload.single("logo"), HotelAuthController.CreateHotel)

export default HotelRoute