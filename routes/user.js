const express = require('express')
const router = express.Router()
const user = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {verifyJWT} = require('../utils')

const createUser =  async (req,res) => {
    const email = req.body.email
    const username = req.body.username
    const passwordHash = bcrypt.hashSync(req.body.password, 8)
    try {
        const newUser = await user.create({email,username,password:passwordHash})
        if(newUser){
            const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET)
            res.json({auth : true, token })
        }
    } catch (err) {
        res.json({error: true, reason: 'email already exists'})
        throw err
    }
}

const getUser = async (req,res) => {
    const token = req.headers['x-access-token'];
    let decodedRes = await verifyJWT(token);
    if (decodedRes.error) res.json(decodedRes)
    else{
        user
            .findById(decodedRes.id)
            .populate('stores')
            .exec((err,data) => {
                if(err) res.json(err)
                else res.json(data)
            })
    }
}

const login = async (req,res) => {
    const email = req.body.email
    const foundUser = await user.find({email}).select('+password')
    if(foundUser.length <= 0)
    res.json({error : true, reason : 'invalid username or password'})
    else if(foundUser.length > 0){
        const match = await bcrypt.compare(
            req.body.password,
            foundUser[0].password
        )
        if(match){
            const token = jwt.sign({id : foundUser[0]._id}, process.env.JWT_SECRET)
            res.json({auth : true, token})
        } else {
            res.json({error : true, reason : 'invalid username or password '})
        }
    }
}

router.post('/new',createUser)
router.get('/',getUser)
router.post('/login',login)

module.exports = router