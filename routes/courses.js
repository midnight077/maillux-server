const express = require('express')
const {getCourses, addCourse, publishCourse, getCourse, editMaterial} = require('../controllers/courses')
const {getSubscribers, addSubscriber, verifySubscriber} = require('../controllers/subscribers')
const router = express.Router();

router.route('/').get(getCourses).post(addCourse)
router.route('/:courseId/').get(getCourse).post(publishCourse).put(editMaterial)
router.route('/:courseId/subscribers').get(getSubscribers).post(addSubscriber)
router.route('/:courseId/subscribers/:subscriberId/verify').get(verifySubscriber)

module.exports = router