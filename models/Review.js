const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    rate: {
        type: Number,
        required: true,
        min: 1,  // Assuming the minimum rate is 1
        max: 5   
    },
    text: {
        type: String,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Review',reviewSchema)