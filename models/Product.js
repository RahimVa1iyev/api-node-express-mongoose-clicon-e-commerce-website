const { number, ref } = require('joi');
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product is require field'],
        minlength: [2, "Product can be at least 2 letters"],
        maxlength: [100, "Product can be a maximum of 25 characters"],
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'Category'
    },
    brandId: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: 'Brand'
    },
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: 'Review'
    }],
    rate : {
        type : Number
    },
    features: [
        {
            name: { type: String},
            option: {
                type: String
            }
        }
    ],
    description: {
        type: String,
        required: [true, 'Description is require field'],
        minlength: [50, "Description can be at least 50 characters"],
        maxlength: [700, "Description can be a maximum of 500 characters"],
    },
    costPrice: {
        type: Number,
        required: [true, 'Price is require field'],
        min: [1, "The price can be as low as $1"],
        max: [15000, "The price can be a maximum of $15000"],
    },
    salePrice: {
        type: Number,
        required: [true, 'Price is require field'],
        min: [1, "The price can be as low as $1"],
        max: [15000, "The price can be a maximum of $15000"],
    },
    discountPercent: {
        type: Number,
        default: 0,
        min: [0, "Discount percent can be as low as 0%"],
        max: [100, "Discoun percent  can be a maximum of 100%"],
    },
    images: [
        {
            imageUrl: { type: String, require: true },
            imageStatus: { type: Boolean, require: true }
        }
    ],
    bestDiscountPercent: {
        type: Number,
        default: 0,
        min: [0, "Discount percent can be as low as 0%"],
        max: [100, "Discoun percent  can be a maximum of 100%"],
    },
    seriaNo: {
        type: Number,
    },
    sellerCount: {
        type: Number,
        default: 0,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    stockCount: {
        type: Number,
        default: 0,
    },
    isHot: {
        type: Boolean,
        default: false,
    },
    isFeature: {
        type: Boolean,
        default: false,
    },
    basketItems : [{type : mongoose.Types.ObjectId , ref : 'BasketItem'}]

})

productSchema.path('costPrice').validate(function (value) {
    return value <= this.salePrice;
}, 'Cost price should not be greater than sale price');


module.exports = mongoose.model('Product', productSchema)