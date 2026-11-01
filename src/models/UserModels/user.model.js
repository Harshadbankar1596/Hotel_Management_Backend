import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    hotelId : {
        type : mongoose.Schema.Types.ObjectId,
        require : [true , "Hotel is Require"],
        ref : "Hotel"
    },
    branchId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Branch"
    },
    name : {
        type : String,
        require : [true , "Name Is Require"]
    },
    email : {
        type : String,
        require : [true , "Email Is Require"]
    },
    phone : {
        type : Number,
        require : [true , "Phone Is Require"]
    },
    role : {
        type : String,
        enum : ["admin" , "branchadmin" , "waiter"],
        default : "waiter"
    }
},{
    timestamps : true
})

UserSchema.index({ hotelId: 1});

export default mongoose.model("User" , UserSchema)