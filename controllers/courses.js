const Course = require('../models/Course')
const User = require('../models/User')
const {verifyJWT} = require('../utils')
exports.getCourses = async (req,res,next) => {
    try {
        const courses = await Course.find();
        return res.status(200).json({
            success : true,
            count : courses.length,
            data : courses
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error : 'Server Error'})
    }
} 

exports.addCourse = async (req,res) => {
    const token = req.headers['x-access-token']
    let decodedRes = await verifyJWT(token)
    if(decodedRes.error) res.json(decodedRes)
    else{
        try {
            const fetchedUser = await User.findById(decodedRes.id);
            const course = await Course.create(req.body.content)
            console.log(course)
            fetchedUser.courses.push(course)
            fetchedUser.save()
            return res.status(201).json({
                success : true,
                data : course
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error : 'Server Error'})
        }
    }
}





