const mongoose = require('mongoose');
exports.SubscriberSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add your name'],
        trim :true
    },
    email:{
        type : String,
        required : true,
        unique : true,
        sparse : true
    },
    isVerified:{
        type : Boolean,
        default: false
    },
    position:{
        type : Number,
        default : 1
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})