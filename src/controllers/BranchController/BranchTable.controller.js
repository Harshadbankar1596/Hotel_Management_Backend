
import mongoose from "mongoose";
import TableModel from "../../models/BranchModels/Table.model.js";
import HotelModel from "../../models/HotelModels/Hotel.model.js";
import BranchModel from "../../models/BranchModels/branch.model.js";
import {
  ErrorLog,
  SuccessLog,
  ResponseLog,
} from "../../helper/GlobalResponseHandler/Response.js";
import { ValidateBody } from "../../helper/Validator/validator.js";

const TableController = {
  addTable: async (req, res) => {
    try {
      const { hotelId, branchId, tables } = req.body;

      const validBody = ValidateBody(
        ["hotelId", "branchId", "tables"],
        req.body
      );

      if (!validBody.isValid) {
        return ResponseLog(res, 400, validBody.message);
      }

      if (
        !mongoose.isValidObjectId(hotelId) ||
        !mongoose.isValidObjectId(branchId)
      ) {
        return ResponseLog(res, 400, "Invalid hotelId or branchId");
      }

      if (!Array.isArray(tables) || tables.length === 0) {
        return ResponseLog(res, 400, "Tables must be a non-empty array");
      }

      const [hotel, branch] = await Promise.all([
        HotelModel.findById(hotelId),
        BranchModel.findById(branchId),
      ]);

      if (!hotel) {
        return ResponseLog(res, 404, "Hotel not found");
      }

      if (!branch) {
        return ResponseLog(res, 404, "Branch not found");
      }

      // Verify branch belongs to hotel
      if (String(branch.hotelId) !== String(hotelId)) {
        return ResponseLog(
          res,
          400,
          "This branch does not belong to this hotel"
        );
      }

      const seenTableNumbers = new Set();

      for (const table of tables) {
        if (
          !table.tableName ||
          !Number.isInteger(Number(table.tableNo)) ||
          Number(table.tableNo) < 1 ||
          !Number.isInteger(Number(table.floorNo)) ||
          Number(table.floorNo) < 1
        ) {
          return ResponseLog(
            res,
            400,
            "Invalid tableName, tableNo or floorNo"
          );
        }

        const tableNo = Number(table.tableNo);

        if (seenTableNumbers.has(tableNo)) {
          return ResponseLog(
            res,
            400,
            `Duplicate table number ${tableNo} in request`
          );
        }

        seenTableNumbers.add(tableNo);
      }

      const existingDocument = await TableModel.findOne({
        hotelId,
        branchId,
      });

      if (existingDocument) {
        const existingNumbers = new Set(
          existingDocument.Tables.map((table) => table.tableNo)
        );

        for (const table of tables) {
          if (existingNumbers.has(Number(table.tableNo))) {
            return ResponseLog(
              res,
              409,
              `Table number ${table.tableNo} already exists`
            );
          }
        }

        existingDocument.Tables.push(...tables);

        await existingDocument.save();

        return SuccessLog(
          res,
          200,
          "Tables added successfully",
          existingDocument
        );
      }

      const newDocument = await TableModel.create({
        hotelId,
        branchId,
        Tables: tables,
      });

      return SuccessLog(
        res,
        201,
        "Tables created successfully",
        newDocument
      );
    } catch (error) {
      ErrorLog(res, error, "Error in add table");
    }
  },

  
};

export default TableController;
