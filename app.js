require('dotenv').config()

// express
const express = require('express')
const app = express()

// connect db
const connectDB = require('./db/connect')

app.get("/", (req,res)=>{
    res.send("Welcome my e-commerce website")
})

const port = process.env.PORT || 5000

const start = async () =>{
    await connectDB(process.env.MONGO_URL).then(res=> console.log("Database succesfully connect")).catch(err => console.log(`Fail db as ${err}`))
    app.listen(port, (req,res) =>{
        console.log(`Server is listening ${port}`)
    })

}

start()