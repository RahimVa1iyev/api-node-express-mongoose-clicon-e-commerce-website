
const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const deleteImage = require('../utils/delete')
const upload = require('../utils/upload')



const updateMe = async (req, res) => {
  
  const {userId} = req.user
  
  const {email,password,confirmPassword,firstName,lastName,userName,address} = req.body

  const user = await User.findOneAndUpdate({_id : userId}, {firstName,lastName,userName,address})
  
  if(password !== confirmPassword) throw new BadRequestError('Confirm password does not match')

  if(password){
    console.log('clicked');
    user.password = password
  }
 

  if (req.files?.image) {
      if (user && user?.image) {
          await deleteImage(user.image);
      }
      const result = await upload(req.files.image)
      user.image = result.secure_url
  }

  if(email) {
    user.email = email
    const verificationToken = crypto.randomBytes(40).toString('hex')
    user.verificationToken = verificationToken
    user.isVerified = false
    const origin = 'http://localhost:5173'
    await sendVerificationEmail({ name: user.firstName, email: user.email, verificationToken: verificationToken, origin })
  }

  await user.save()

  res.status(StatusCodes.OK).json({msg : "User updated succesfully"})
}

const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password')
    res.status(StatusCodes.OK).json({ users })
}

const getCurrentUser = async (req, res) => {
  console.log(req.user.userId);
    const user = await User.findOne({_id : req.user.userId}).select('-password -verificationToken -isVerified -role')
    res.status(StatusCodes.OK).json({user})
}

const getUser = async (req, res) => {
  const {id} = req.params
  const user = await User.findOne({_id : id}).select('-password')
 console.log(user);
  if(!user) throw new NotFoundError(`User not found by id : ${id}`)

  res.status(StatusCodes.OK).json({user})
}




module.exports = { getAllUsers, getUser, getCurrentUser, updateMe }