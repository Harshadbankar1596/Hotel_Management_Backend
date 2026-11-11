import express from "express"
import BranchMenueController from "../../controllers/BranchController/BranchMeue.controller.js"
import UserAuth from "../../middleware/UserAuth.middleware.js"
import PermissionAuth from "../../middleware/Permission.middleware.js"
import upload from "../../middleware/upload.middleware.js"

const route = express.Router()

route.post("/add-menue" , UserAuth , PermissionAuth , upload.single("image") , BranchMenueController.addMenue)


export default route