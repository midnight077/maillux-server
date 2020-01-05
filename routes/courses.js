const express = require('express')
const {getCourses, addCourse} = require('../controllers/courses')
const router = express.Router();

router.route('/').get(getCourses).post(addCourse)

module.exports = router