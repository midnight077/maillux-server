const express = require('express')
const {getCourses, addCourse} = require('../controllers/subscribers')
const router = express.Router();

router.route('/').get(getSubscribers).post(addSubscriber).put(verifySubscriber)

module.exports = router