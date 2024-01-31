require('dotenv').config()
require('express-async-errors')
const cors = require('cors'); // Add this line

// express
const express = require('express')
const app = express()

// rest of the packes
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
app.use(cors());

// use Cloudinary.v2
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


// connect db
const connectDB = require('./db/connect')

// routes
const autRoutes = require('./routes/authRoute')
const userRoutes = require('./routes/userRoute')
const categoryRoutes = require('./routes/categoryRoute')
const brandRoutes = require('./routes/brandRoute')
const featureRoutes = require('./routes/featureRoute')
const productRoutes = require('./routes/productRoute')
const sliderRoutes = require('./routes/sliderRoute')
const reviewRoutes = require('./routes/reviewRoute')




// middleware
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')

// express-midlleware
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload({useTempFiles : true}))


app.get("/", (req,res)=>{
    res.send("Welcome my e-commerce website")
})

app.use('/api/v1/auth',autRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/categories',categoryRoutes)
app.use('/api/v1/brands',brandRoutes)
app.use('/api/v1/features',featureRoutes)
app.use('/api/v1/products',productRoutes)
app.use('/api/v1/sliders',sliderRoutes)
app.use('/api/v1/reviews',reviewRoutes)


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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