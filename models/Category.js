const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        uniquie: [true, 'This category is exist'],
        require : [true, 'Category is require field'],
        minlength: [2, "Category must be more than 2 letters"],
        maxlength: [25, "Category must be more than 25 letters"],
    }
})

module.exports = mongoose.model('Category', categorySchema)