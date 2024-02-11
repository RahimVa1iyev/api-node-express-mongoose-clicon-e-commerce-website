const mongoose = require('mongoose')


const basketItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 0 }
})

module.exports = mongoose.model('BasketItem',basketItemSchema)