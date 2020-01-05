const express = require('express')
const {getCourses, addCourse} = require('../controllers/courses')
const {getSubscribers, addSubscriber} = require('../controllers/subscribers')
const router = express.Router();

router.route('/').get(getCourses).post(addCourse)
router.route('/:courseId/subscribers').get(getSubscribers).post(addSubscriber)

module.exports = router