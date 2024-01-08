require('dotenv').config()
require('express-async-errors')

// express
const express = require('express')
const app = express()

// rest of the packes
const morgan = require('morgan')


// connect db
const connectDB = require('./db/connect')

// middleware
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')

// express-midlleware
app.use(morgan('tiny'))
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Welcome my e-commerce website")
})


// add-middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 5000

const start = async () =>{
    await connectDB(process.env.MONGO_URL).then(res=> console.log("Database succesfully connect")).catch(err => console.log(`Fail db as ${err}`))
    app.listen(port, (req,res) =>{
        console.log(`Server is listening ${port}`)
    })

}

start()