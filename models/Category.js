const { string } = require('joi')
const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        uniquie: [true, 'This category is exist'],
        required : [true, 'Category is require field'],
        minlength: [2, "Category can be at least 2 letters"],
        maxlength: [25, "Category can be a maximum of 25 characters"],
    },
    features : [{type : mongoose.Types.ObjectId , ref : 'Feature'}],
    products : [{type : mongoose.Types.ObjectId , ref: 'Product'}],
    brands : [{type:mongoose.Types.ObjectId , ref : 'Brand'}],
    image : {type : String}


})

module.exports = mongoose.model('Category', categorySchema)