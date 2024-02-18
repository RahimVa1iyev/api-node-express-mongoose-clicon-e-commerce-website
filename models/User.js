const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required: [true,"First name is required field"],
        minlength : [2,"First name must be more than 2 letters"],
        maxlength : [25,"First name must be more than 25 letters"],
    },
    lastName : {
        type:String,
        required: [true,"Last name is required field"],
        minlength : [2,"Last name must be more than 2 letters"],
        maxlength : [25,"Last name must be more than 25 letters"],
    },
    userName : {
        type:String,
        unique:[true, 'User name already exist'],
        required: [true,"User name is required field"],
        minlength : [2,"User name must be more than 2 letters"],
        maxlength : [25,"User name must be more than 25 letters"],
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
    address : {
        type : String,
        minlength : [2,"Name must be more than 2 letters"],
        maxlength : [100,"Name must be more than 100 letters"],
    },
    image : {type : String},
    password:{
        type : String,
        required :[true,'Password is provided'],
        minlength:6
    },
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: 'Review'
    }],
    role:{
        type:String,
        enum :['admin','user']
    },
    verificationToken : {type : String},
    isVerified : {type: Boolean , default:false},
    verified:{type: Date},
    passwordToken : {type : String},
    passwordTokenExpirationDate : {type : Date},
    basketItems : [{type : mongoose.Types.ObjectId , ref : 'BasketItem'}]

})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(cantitadePassword){
    const isMatch = await bcrypt.compare(cantitadePassword,this.password)
    return isMatch
}

module.exports = mongoose.model("User",userSchema)

