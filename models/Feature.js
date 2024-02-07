const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required : [true, 'Feature is require field'],
        uniquie: [true, 'This feature is exist'],
        minlength: [2, "Feature can be at least than  letters"],
        maxlength: [25, "Feature can be a maximum of 25 characters"],
    },
    categories: [{type: mongoose.Types.ObjectId , ref: 'Category'}],
    options : [{type:String}]
})

module.exports = mongoose.model('Feature',featureSchema)