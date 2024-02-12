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
    userName : {
        type:String,
        minlength : [2,"Name must be more than 2 letters"],
        maxlength : [25,"Name must be more than 25 letters"],
    },
    address : {
        type : String,
        minlength : [2,"Name must be more than 2 letters"],
        maxlength : [100,"Name must be more than 100 letters"],
    },
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
    verified:{type: Date}
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
    console.log('cadidate',cantitadePassword);
    const isMatch = await bcrypt.compare(cantitadePassword,this.password)
    return isMatch
}

module.exports = mongoose.model("User",userSchema)

