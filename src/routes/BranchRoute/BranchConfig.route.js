import express from "express"
import BranchConfigController from "../../controllers/BranchController/BranchConfig.controller.js"
import UserAuth from "../../middleware/UserAuth.middleware.js"
import PermissionAuth from "../../middleware/Permission.middleware.js"

const route = express.Router()

route.post("/create" , UserAuth , PermissionAuth , BranchConfigController.createConfig)

export default route