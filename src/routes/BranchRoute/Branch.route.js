import express from "express"
import BranchController from "../../controllers/BranchController/Branch.controller.js"
import PermissionAuth from "../../middleware/Permission.middleware.js"
import UserAuth from "../../middleware/UserAuth.middleware.js"
import BranchConfigRoute from "./BranchConfig.route.js"
import BranchMenueRoute from "./BranchMenue.route.js"
import BranchTableRoute from "./BranchTable.route.js"

const route = express.Router()
                                                                            
route.post("/create" , UserAuth , PermissionAuth , BranchController.CreateBranch)


route.use("/menue" , BranchMenueRoute)
route.use("/config" , BranchConfigRoute)
route.use("/table" , BranchTableRoute)

export default route