const mongoose = require('mongoose');
const { SubscriberSchema } = require('../models/Subscriber');
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add the course title'],
        unique: false,
        trim: true
    },
    isFirstSave: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number,
        required: [true, 'Please add the course duration (days)']
    },
    content: {
        type: []
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    subscribers: [SubscriberSchema],
    author: {
        type: String,
        default: ''
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

CourseSchema.pre('save', async function(next) {
    console.log(this.isFirstSave);
    if (this.isFirstSave) {
        this.content = Array(this.duration).fill([{ material: 'hey wow' }]);
        this.isFirstSave = false;
    }

    next();
});

module.exports = mongoose.model('Course', CourseSchema);
