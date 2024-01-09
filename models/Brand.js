const mongoose = require('mongoose')


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        require : [true, 'Brand is require field'],
        uniquie: [true, 'This brand is exist'],
        minlength: [2, "Brand must be more than 2 letters"],
        maxlength: [25, "Brand must be more than 25 letters"],
    },
    categories: [{ type: mongoose.Types.ObjectId, require:[true,'This field is required'], ref: 'Category' }]
})

module.exports = mongoose.model('Brand', brandSchema)