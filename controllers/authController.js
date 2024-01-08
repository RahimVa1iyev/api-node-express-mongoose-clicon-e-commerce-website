const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')


const login = async (req,res) =>{
    res.status(StatusCodes.OK).json()
}


const register = async (req,res) =>{
    res.status(StatusCodes.CREATED).json()
}


const logout = async (req,res) =>{
    res.status(StatusCodes.OK).json()
}

module.exports = {login,register,logout}