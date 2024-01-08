const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const UnauthenticatedError = require('../errors/un-authenticated')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')


const login = async (req,res) =>{
    const {email,password} = req.body
    if(!email || !password) throw new BadRequestError('Email and password are require fileds')

    const user = await User.findOne({email})
    if(!user) throw new NotFoundError('User not found')

    const isPasswordCorrect = user.comparePassword(password)
    if(!isPasswordCorrect) throw new UnauthenticatedError('Email or password is not correct')

    
    res.status(StatusCodes.OK).json()
}


const register = async (req,res) =>{
    res.status(StatusCodes.CREATED).json()
}


const logout = async (req,res) =>{
    res.status(StatusCodes.OK).json()
}

module.exports = {login,register,logout}