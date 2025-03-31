import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    role : {//you can pass multiple values
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    verificationToken:{
        type: String
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpiry:{
        type: Date,
    },
}, {
    timestamps: true
    })

const User = mongoose.model("User", userSchema)


export default User;