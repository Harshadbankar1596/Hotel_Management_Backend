import express from "express"
import HotelAuthController from "../../controllers/HotelControllers/HotelAuth.controller.js"
const HotelRoute = express.Router()

HotelRoute.post("/create" , HotelAuthController.CreateHotel)

export default HotelRoute