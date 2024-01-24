const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required: [true,"Name is required field"],
        minlength : [2,"Name must be more than 2 letters"],
        maxlength : [25,"Name must be more than 25 letters"],
    },
    email:{
        type : String,
        unique:[true, 'Email already exist'],
        required :[true,'Email is required field'],
        validate : {
            validator : validator.isEmail,
            message : 'Please provide valid email'
        }
    },
    password:{
        type : String,
        required :[true,'Password is provided'],
        minlength:6
    },
    review: [{
        type: mongoose.Types.ObjectId,
        ref: 'Review'
    }],
    role:{
        type:String,
        enum :['admin','user']
    }
    
})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.comparePassword = async function(cantitadePassword){
    const isMatch = await bcrypt.compare(cantitadePassword,this.password)
    return isMatch
}

module.exports = mongoose.model("User",userSchema)

