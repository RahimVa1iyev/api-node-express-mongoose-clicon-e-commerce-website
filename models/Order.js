const mongoose = require('mongoose')
const validator = require('validator')


const orderSchema = new mongoose.Schema({
    userId : {type: mongoose.Types.ObjectId , ref : 'User'},
    firstName : {type:String},
    lastName : {type:String},
    email:{
        type : String,
        required :[true,'Email is required field'],
        validate : {
            validator : validator.isEmail,
            message : 'Please provide valid email'
        }
    },
    phone : {
        type : String
    },
    createdAt : {
        type : Date
    },
    address : {
        type : String
    },
    text : {
        type : String
    },
    totalAmount : {
        type : Number,
        default :0
    },
    orderStatus : {
        type : String,
        enum: ['pending','packaging','road','delivered','rejected'],
        default: 'pending',
    },
    orderItems : [{type : mongoose.Types.ObjectId , ref : 'OrderItem'} ]

})

module.exports = mongoose.model('Order',orderSchema)