import express from "express";

//  hotel router
import HotelRoute from "./HotelRoutes/HotelAuth.route.js";

// admin auth route
import AdminAuthRoute from "./AdminRoutes/SuperAdminAuth.route.js";

const IndexRouter = express.Router();

IndexRouter.use("/hotel", HotelRoute);

IndexRouter.use("/superadmin", AdminAuthRoute);

export default IndexRouter;
