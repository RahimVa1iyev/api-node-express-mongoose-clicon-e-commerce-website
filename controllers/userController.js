
const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')



const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password')
    res.status(StatusCodes.OK).json({ users })
}

const getCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user : req.user}).select('-password')
}

const getUser = async (req, res) => {
  const {id} = req.params
  const user = await User.findOne({_id : id}).select('-password')
 console.log(user);
  if(!user) throw new NotFoundError(`User not found by id : ${id}`)

  res.status(StatusCodes.OK).json({user})
}


const updateUser = async (req, res) => {
  const {userId} = req.user
  console.log(userId);
  const {email,name,password,confirmPassword} = req.body
  
  if(password !== confirmPassword) throw new BadRequestError('Confirm password is not matching')

  const updatedUser = await User.findOneAndUpdate({_id : userId})

}




module.exports = { getAllUsers, getUser, getCurrentUser, updateUser }