const mongoose = require('mongoose')

const sliderSchema = new mongoose.Schema({
    headTitle: {
        type: String,
        minlength: [10, "Head title can be at least than  letters"],
        maxlength: [60, "Head Title can be a maximum of 60 characters"],
    },
    title: {
        type: String,
        require: [true, 'Title is require field'],
        minlength: [10, "Title can be at least than  letters"],
        maxlength: [60, "Title can be a maximum of 60 characters"],
    },
    description: {
        type: String,
        minlength: [10, "Description can be at least than  letters"],
        maxlength: [200, "Description can be a maximum of 200 characters"],
    },
    image: {
        type: String,
        require: [true, 'Image is require field'],
    },
    status: {
        type: Boolean,
    },
    order: {
        type: Number
    },
    btnUrl:{
        type :String
    },
    price: {
        type: Number,
    }
})

module.exports = mongoose.model("Slider", sliderSchema)

