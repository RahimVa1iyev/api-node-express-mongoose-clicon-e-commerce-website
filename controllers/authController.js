const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const UnauthenticatedError = require('../errors/un-authenticated')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { createUserToken, attachCookiesToResponse } = require('../utils')


const login = async (req,res) =>{
    const {email,password} = req.body
    if(!email || !password) throw new BadRequestError('Email and password are require fileds')

    const user = await User.findOne({email})
    if(!user) throw new NotFoundError('User not found')

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) throw new UnauthenticatedError('Email or password is not correct')

    const userToken = createUserToken(user)
    attachCookiesToResponse({res,user})
    res.status(StatusCodes.OK).json({user:userToken})
}


const register = async (req,res) =>{
    const {name,email,password,confirmPassword} = req.body

    if(!confirmPassword && password !== confirmPassword) throw new BadRequestError('Confirm password does not match')

    const role = 'user'
    const user = await User.create({name,email,password,role})

    const userToken = createUserToken(user)
    attachCookiesToResponse({res,user})

    res.status(StatusCodes.CREATED).json({user:userToken})
}


const logout = async (req,res) =>{
    res.cookie('token','logout',{
        httpOnly:true,
        expiresIn: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json()
}

module.exports = {login,register,logout}