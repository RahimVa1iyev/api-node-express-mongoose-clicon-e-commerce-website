const mongoose = require('mongoose')


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, 'Brand is require field'],
        uniquie: [true, 'This brand is exist'],
        minlength: [2, "Brand can be at least than  letters"],
        maxlength: [25, "Brand can be a maximum of 25 characters"],
    },
    categories: [{ type: mongoose.Types.ObjectId, require:[true,'This field is required'], ref: 'Category' }],
    products : [{type : mongoose.Types.ObjectId , ref: 'Product'}]
})

module.exports = mongoose.model('Brand', brandSchema)