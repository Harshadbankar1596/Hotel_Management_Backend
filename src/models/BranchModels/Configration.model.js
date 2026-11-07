import mongoose from "mongoose"

const BranchTaxSchema = new mongoose.Schema({
    taxName : {
        type : String,
        required : true,
    },
    taxType : {
        type : String,
        enum : ["fixed" , "percentage"],
        required : true
    },
    taxValue : {
        type : Number,
        required : true,
        min : 0
    }
})

const ConfigrationSchema = new mongoose.Schema({
    hotelId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Hotel"
    },

    branchId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Branch"
    },

    taxes : [BranchTaxSchema]
    
})

export default mongoose.model("BranchConfig" , ConfigrationSchema)