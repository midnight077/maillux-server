const Course = require('../models/Course');
const {sendVerificationMail,sendVerificationSuccessfulMail} = require('../config/email/utils')

exports.getSubscribers = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.courseId });
        return res.status(200).json({
            success: true,
            count: course.subscribers.length,
            data: course.subscribers
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.addSubscriber = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.courseId });
        const subscriber = {
            name: req.body.name,
            email: req.body.email
        };
        course.subscribers.push(subscriber);
       
        const info = await sendVerificationMail(
            course,
            course.subscribers[course.subscribers.length - 1]
        );
        course.save();
        console.log(info);
        return res.status(201).json({
            success: true,
            data: course.subscribers[course.subscribers.length - 1]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.verifySubscriber = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.courseId });
        let s = 0;
        while (s < course.subscribers.length) {
            if (course.subscribers[s]._id == req.params.subscriberId) {
                if (course.subscribers[s].isVerified) throw 'Already verified';
                course.subscribers[s].isVerified = true;
                break;
            }
            s++;
        }
        if (s == course.subscribers.length) throw 'Subscriber not found!';
        const info = await sendVerificationSuccessfulMail(course,course.subscribers[s])
        console.log(info)
     
        if(timeCheck()) {
            const info = await sendFirstMail(course, course.subscribers[s])
            console.log(info)
            course.subscribers[s].position += 1
        }
        course.save();
        return res.end('Email verification Successful!');
    } catch (error) {
        console.log(error)
        return res.end(error);
    }
};
