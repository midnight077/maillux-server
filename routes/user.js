const express = require('express')
const router = express.Router()
const {createUser, getUser, login} = require('../controllers/user')

router.post('/new',createUser)
router.get('/',getUser)
router.post('/login',login)

module.exports = router