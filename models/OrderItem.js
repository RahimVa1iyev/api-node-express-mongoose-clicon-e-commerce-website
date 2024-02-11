const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    productId : { type : mongoose.Types.ObjectId , ref : 'Product'},
    orderId : {type : mongoose.Types.ObjectId , ref : 'Order'},
    count : {type : Number},
    unitSalePrice : {type : Number},
    unitCostPrice : {type : Number}, 
    unitDiscountedPrice : {type : Number}, 

})

module.exports = mongoose.model('OrderItem',orderItemSchema)