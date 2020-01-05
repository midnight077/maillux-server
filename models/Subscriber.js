const mongoose = require('mongoose');
const SubscriberSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add your name'],
        trim :true
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    isVerified:{
        type : Boolean,
        default: false
    },
    position:{
        type : Number,
        default : 1
    },
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course',
        select : false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
 
module.exports = mongoose.model('Subscriber', SubscriberSchema)