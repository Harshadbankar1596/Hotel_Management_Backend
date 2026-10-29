import HotelModel from "../../models/HotelModels/Hotel.model.js";
import {
  ErrorLog,
  ResponseLog,
  SuccessLog,
} from "../../helper/GlobalResponseHandler/Response.js";
import {
  ValidateBody,
  ValidateEmail,
  ValidatePhone,
} from "../../helper/Validator/validator.js";

const HotelAuthController = {
  CreateHotel: async (req, res) => {
    try {
      const { name, email, phone, address, logo, ownerName } = req.body;

      let validData = ValidateBody(
        ["name", "email", "phone", "ownerName"],
        req.body,
      );

      if (!validData.isValid) {
        return ResponseLog(res, 400, validData.message);
      }
      const hotelName = name.trim();

      if (hotelName.length < 2 || hotelName.length > 150) {
        return ResponseLog(
          res,
          400,
          "Hotel name must be between 2 and 150 characters",
        );
      }

      let validEmail = ValidateEmail(email);
      if (!validEmail.isValid) {
        return ResponseLog(res, 400, validEmail.message);
      }
      const validPhone = ValidatePhone(phone);
      if (!validPhone.isValid) {
        return ResponseLog(res, 400, validPhone.message);
      }

      const hotel = await HotelModel.create({
        name: hotelName,
        email,
        phone,
        address,
        logo,
        ownerName,
      });

      if (!hotel) {
        return ResponseLog(res, 400, "error in create hotel");
      }

      return SuccessLog(res, 201, "Hotel created successfully", hotel);
    } catch (error) {
      return ErrorLog(res, error, "Failed to create hotel");
    }
  },
};

export default HotelAuthController;
