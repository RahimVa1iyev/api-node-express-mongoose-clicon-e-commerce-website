const UnauthenticatedError = require("../errors/un-authenticated")
const UnauthorizedError = require("../errors/un-authorized")
const Token = require("../models/Token")
const { verifyToken, attachCookiesToResponse } = require("../utils")


const authenticateUser = async (req, res, next) => {
    const { refreshToken, accessToken } = req.signedCookies

    try {
        if (accessToken) {
            const  {payload}  = verifyToken( accessToken )
            req.user = { userId: payload.user._id, name: payload.user.name, role: payload.user.role }
            next()
            return
        }

        const {payload} = verifyToken(refreshToken)

        const existingToken = await Token.findOne({
            user: payload.user._id,
            refreshToken: payload.refreshToken
        })

        if (!existingToken || !existingToken?.isValid) {
            console.log('exis',existingToken);
            throw new UnauthenticatedError('Authentication is not valid')
        }
        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken
        })
        req.user = { userId: payload.user._id, name: payload.user.name, role: payload.user.role }
        next()

    } catch (error) {
        throw new UnauthenticatedError('Authentication is not valid')
    }
}

const authorizePermission = (...roles) => {
    return async (req, res, next) => {
        const role = req.user.role
        if (!roles.includes(role)) throw new UnauthorizedError('Unauthorized to access to route')
        next()
    }
}

module.exports = { authenticateUser, authorizePermission }