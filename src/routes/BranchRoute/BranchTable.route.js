import express from "express"
import TableController from "../../controllers/BranchController/BranchTable.controller.js"
import UserAuth from "../../middleware/UserAuth.middleware.js"
import PermissionAuth from "../../middleware/Permission.middleware.js"

const route = express.Router()

route.post("/add" , UserAuth , PermissionAuth , TableController.addTable)
route.get("/get-table/:hotelId/:branchId" , UserAuth , TableController.getTable)

export default route