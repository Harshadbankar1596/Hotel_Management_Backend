import express from "express"
import HotelAuthController from "../../controllers/HotelControllers/HotelAuth.controller.js"
import SuperAdminAuth from "../../middleware/SuperAdminMiddleware.js"

const HotelRoute = express.Router()

HotelRoute.post("/create" , SuperAdminAuth , HotelAuthController.CreateHotel)

export default HotelRoute