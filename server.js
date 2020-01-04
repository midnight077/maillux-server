const path = require('path');
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
dotenv.config({path : './config/config.env'})
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
connectDB()
const PORT = process.env.PORT || 8800

app.listen(PORT,()=>console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))