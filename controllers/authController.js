const BadRequestError = require('../errors/bad-request')
const NotFoundError = require('../errors/not-found')
const UnauthenticatedError = require('../errors/un-authenticated')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { createUserToken, attachCookiesToResponse, sendResetPasswordEmail, createHash } = require('../utils')
const crypto = require('crypto')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const Token = require('../models/Token')



// const login = async (req, res) => {
//     const { email, password } = req.body
//     if (!email || !password) throw new BadRequestError('Email and password are require fileds')

//     const user = await User.findOne({ email })
//     if (!user) throw new NotFoundError('User not found')


//     const isPasswordCorrect = await user.comparePassword(password)

//     if (!isPasswordCorrect) throw new UnauthenticatedError('Email or password is not correct')

//     if (!user.isVerified) throw new UnauthenticatedError('Please verify your email')

//     const tokenUser = createUserToken(user)

//     let refreshToken = '';

//     const existingToken = await Token.findOne({ user: user._id })
//     if (existingToken) {
//         const { isValid } = existingToken;
//         if (!isValid) {
//             throw new UnauthenticatedError('Invalid Credentials')
//         }
//         refreshToken = existingToken.refreshToken
//         attachCookiesToResponse({ res, user, refreshToken })
//         res.status(StatusCodes.OK).json({ user: tokenUser , basketItems : user.basketItems , orders:user.orders })
//         return;
//     }

//     refreshToken = crypto.randomBytes(40).toString('hex')
//     const userAgent = req.headers['user-agent']
//     const ip = req.ip
//     const userToken = { refreshToken, ip, userAgent, user: user._id }

//     await Token.create(userToken)

//     attachCookiesToResponse({ res, user, refreshToken })

//     res.status(StatusCodes.OK).json({ user: tokenUser , basketItems : user.basketItems , orders:user.orders })

// }

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) throw new BadRequestError('Email and password are required fields')

    const user = await User.findOne({ email })
    if (!user) throw new NotFoundError('User not found')

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) throw new UnauthenticatedError('Email or password is not correct')

    if (!user.isVerified) throw new UnauthenticatedError('Please verify your email')

    const tokenUser = createUserToken(user)

    let refreshToken = '';

    const existingToken = await Token.findOne({ user: user._id })
    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
            throw new UnauthenticatedError('Invalid Credentials')
        }
        refreshToken = existingToken.refreshToken
    } else {
        refreshToken = crypto.randomBytes(40).toString('hex')
        const userAgent = req.headers['user-agent']
        const ip = req.ip
        const userToken = { refreshToken, ip, userAgent, user: user._id }

        await Token.create(userToken)
    }

    // Burada attachCookiesToResponse fonksiyonunu çağırdım.
    attachCookiesToResponse({ res, user, refreshToken })

    res.status(StatusCodes.OK).json({ user: tokenUser , basketItems : user.basketItems , orders:user.orders })
}



const register = async (req, res) => {
    const { password, confirmPassword } = req.body

    if (!confirmPassword && password !== confirmPassword) throw new BadRequestError('Confirm password does not match')
    const role = 'user'

    const verificationToken = crypto.randomBytes(40).toString('hex')
    const user = await User.create({ ...req.body , role, verificationToken })
    const origin = 'http://localhost:5173'
    await sendVerificationEmail({ name: user.firstName, email: user.email, verificationToken: user.verificationToken, origin })
    // const userToken = createUserToken(user)
    // attachCookiesToResponse({res,user})

    res.status(StatusCodes.CREATED).json({ msg: 'Please verify your email' })
}


const logout = async (req, res) => {
    console.log(req.user);
    await Token.findOneAndDelete({ user: req.user.userId })
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expiresIn: new Date(Date.now())
    })
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expiresIn: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({ msj: 'user logged out' })
}

const verifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body


    const user = await User.findOne({ email: email })

    if (!user) throw new UnauthenticatedError('Verification Failed')

    if (verificationToken !== user.verificationToken) throw new UnauthenticatedError('Verification Failed')

    user.isVerified = true
    user.verified = Date.now()
    user.verificationToken = ''

    await user.save()
    res.status(StatusCodes.OK).json({ msg: 'Your email successfully verified' })
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    if (!email) throw new BadRequestError('Please provide email address')

    const user = await User.findOne({ email })

    if (user) {
        const passwordToken = crypto.randomBytes(70).toString('hex')

        const origin = 'http://localhost:5173'
        await sendResetPasswordEmail({ name: user.firstName, email: user.email, token: passwordToken, origin })

        const tenMinutes = 1000 * 60 * 10
        const passwordTokenExpiration = new Date(Date.now() + tenMinutes)

        user.passwordToken = createHash(passwordToken)
        user.passwordTokenExpirationDate = passwordTokenExpiration
        await user.save()
    }

    res.status(StatusCodes.OK).json({ msj: 'Please check your email for reset password link' })

}

const resetPassword = async (req, res) => {

    const { token, email, password, confirmPassword } = req.body

    if (!token || !email || !password || !confirmPassword) throw new BadRequestError('Provides all fields')

    if (password !== confirmPassword) throw new BadRequestError('Confirm password does not match')

    const user = await User.findOne({ email })



    if (user) {
        const currentDate = new Date()
        if (createHash(token) !== user.passwordToken && user.passwordTokenExpirationDate < currentDate) throw new UnauthenticatedError('Invalid credential')
        user.password = password
        user.passwordToken = null
        user.passwordTokenExpirationDate = null
        await user.save()
    }

    res.status(StatusCodes.OK).json({msg : 'Your password succesfully changed'})


}

module.exports = { login, register, verifyEmail, forgotPassword, resetPassword, logout }