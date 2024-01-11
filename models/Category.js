const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        uniquie: [true, 'This category is exist'],
        required : [true, 'Category is require field'],
        minlength: [2, "Category can be at least 2 letters"],
        maxlength: [25, "Category can be a maximum of 25 characters"],
    },
})

module.exports = mongoose.model('Category', categorySchema)