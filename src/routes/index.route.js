 import express from "express"

//  hotel router
import HotelRoute from "./HotelRoutes/HotelAuth.route.js"

 const IndexRouter = express.Router()


 IndexRouter.use("/hotel" , HotelRoute)

 export default IndexRouter