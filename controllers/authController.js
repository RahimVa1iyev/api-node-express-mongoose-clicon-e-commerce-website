const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const UnauthenticatedError = require('../errors/un-authenticated')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { createUserToken, attachCookiesToResponse, verifyToken } = require('../utils')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')
const sendVerificationEmail = require('../utils/sendVerificationEmail')



const login = async (req,res) =>{
    const {email,password} = req.body
    if(!email || !password) throw new BadRequestError('Email and password are require fileds')

    const user = await User.findOne({email})
    if(!user) throw new NotFoundError('User not found')
    

    const isPasswordCorrect = await user.comparePassword(password)
    console.log(isPasswordCorrect);
    if(!isPasswordCorrect) throw new UnauthenticatedError('Email or password is not correct')

    if(!user.verified) throw new UnauthenticatedError('Please verify your email')

    const userToken = createUserToken(user)
    attachCookiesToResponse({res,user})
    res.status(StatusCodes.OK).json({user:userToken})
}


const register = async (req,res) =>{
    const {name,email,password,confirmPassword} = req.body

    if(!confirmPassword && password !== confirmPassword) throw new BadRequestError('Confirm password does not match')
    const role = 'user'


    const verificationToken = crypto.randomBytes(40).toString('hex')
    const user = await User.create({name,email,password,role,verificationToken})
    const origin = 'http://localhost:3000'
    await sendVerificationEmail({name : user.name , email : user.email , verificationToken : user.verificationToken ,origin })
    // const userToken = createUserToken(user)
    // attachCookiesToResponse({res,user})

    res.status(StatusCodes.CREATED).json({msg : 'Please verify your email'})
}


const logout = async (req,res) =>{
    res.cookie('token','logout',{
        httpOnly:true,
        expiresIn: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json()
}

const verifyEmail  = async (req,res) =>{
    const {verificationToken ,email} = req.body


    const user = await User.findOne({email : email})

    if(!user) throw new UnauthenticatedError('Verification Failed')

    if(verificationToken !== user.verificationToken) throw new UnauthenticatedError('Verification Failed')

        user.isVerified = true
        user.verified = Date.now()
        user.verificationToken = ''

    await user.save()
    res.status(StatusCodes.OK).json({msg: 'Your email successfully verified'})
}

module.exports = {login,register,verifyEmail,logout}