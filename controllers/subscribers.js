const Course = require('../models/Course')
exports.getSubscribers = async (req,res) => {
    try {
        const course = await Course.findOne({_id : req.params.courseId});
        return res.status(200).json({
            success : true,
            count : course.subscribers.length,
            data : course.subscribers
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error : 'Server Error'})
    }
} 

exports.addSubscriber = async (req,res) => {
        try {
            const course = await Course.findOne({_id : req.params.courseId});
            let subscriber = {
                name : req.body.name,
                email : req.body.email
            }
            course.subscribers.push(subscriber)
            course.save()
            return res.status(201).json({
                success : true,
                data : course.subscribers[course.subscribers.length-1]
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error : 'Server Error'})
        }
    
}

