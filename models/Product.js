const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand is require field'],
        uniquie: [true, 'This brand is exist'],
        minlength: [2, "Brand can be at least 2 letters"],
        maxlength: [25, "Brand can be a maximum of 25 characters"],
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
    features: [
        {
            name: { type: String },
            options: [{
                type: String
            }]
        }
    ],
    colors: [
        { type: String, required: [true, 'Color is required field'] }
    ],
    description: {
        type: String,
        required: [true, 'Description is require field'],
        minlength: [50, "Description can be at least 50 characters"],
        maxlength: [500, "Description can be a maximum of 500 characters"],
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
            type: String, require: true
        }
    ],
    bestDiscountPercent: {
        type: Number,
        default: 0,
        min: [0, "Discount percent can be as low as 0%"],
        max: [100, "Discoun percent  can be a maximum of 100%"],
    },
    sellerCount: {
        type: Number,
        default: 0,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    stockStatus: {
        type: Boolean,
        default: false,
    },
    isHot: {
        type: Boolean,
        default: false,
    },
    isFeature: {
        type: Boolean,
        default: false,
    },



})

productSchema.path('costPrice').validate(function (value) {
    return value <= this.salePrice;
}, 'Cost price should not be greater than sale price');


module.exports = mongoose.model('Product', productSchema)