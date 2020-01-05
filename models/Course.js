const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please add the course title'],
        unique : false,
        trim :true
    },
    duration:{
        type : Number,
        required : [true, 'Please add the course duration (days)']
    },
    format:{
        type : Number, // Morning : 0, Evening : 1, Both : 2
        required : true
    },
    content:{
        type : []
    },
    subscribers:[SubscriberSchema],
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        select : false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

CourseSchema.pre('save', async function(next){
    if(this.format === 2)  this.content =  Array(this.duration).fill([{ material : '' }, { material : '' }])
    else this.content = Array(this.duration).fill([{ material : '' }])
    next()
})

module.exports = mongoose.model('Course', CourseSchema)