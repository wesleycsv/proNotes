const express = require("express")
require("dotenv").config()
const cors = require("cors")
const { mongoConnect } = require("./config/mongo")

const router = require("./router")


const app = express()
app.use(cors())
app.use(express.json())
mongoConnect()

app.use(router)

app.listen(process.env.MONGO_PORT, ()=> console.log("Server Running"))