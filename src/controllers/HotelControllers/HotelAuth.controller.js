import HotelModel from "../../models/HotelModels/Hotel.model.js";
import {
  ErrorLog,
  SuccessLog,
} from "../../helper/GlobalResponseHandler/Response.js";

const HotelAuthController = {
  CreateHotel: async (req, res) => {
    try {
      const { name, email, phone, address, logo, ownerName } = req.body;

      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Hotel name is required",
        });
      }

      const hotelName = name.trim();

      if (hotelName.length < 2 || hotelName.length > 150) {
        return res.status(400).json({
          success: false,
          message: "Hotel name must be between 2 and 150 characters",
        });
      }

      const hotel = await HotelModel.create({
        name: hotelName,
        email,
        phone,
        address,
        logo,
        ownerName,
      });

      return SuccessLog(res, 201, "Hotel created successfully", hotel);
    } catch (error) {
      return ErrorLog(res, error, "Failed to create hotel");
    }
  },
};

export default HotelAuthController;
