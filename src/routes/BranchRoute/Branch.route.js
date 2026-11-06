import express from "express"
import BranchController from "../../controllers/BranchController/Branch.controller.js"
import PermissionAuth from "../../middleware/Permission.middleware.js"
import UserAuth from "../../middleware/UserAuth.middleware.js"
import upload from "../../middleware/upload.middleware.js"
import BranchMenueController from "../../controllers/BranchMenueControllers/BranchMeue.controller.js"
const route = express.Router()
                                                                            
route.post("/create" , UserAuth , PermissionAuth , BranchController.CreateBranch)


route.post("/add-menue" , UserAuth , PermissionAuth , upload.single("image") , BranchMenueController.addMenue)

export default route