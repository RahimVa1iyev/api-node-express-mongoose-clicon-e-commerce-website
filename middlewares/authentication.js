const UnauthenticatedError = require("../errors/un-authenticated")
const UnauthorizedError = require("../errors/un-authorized")
const { verifyToken } = require("../utils")


const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) throw new UnauthenticatedError('Authentication is not valid')

    try {
        const { payload } = verifyToken({ token })
        req.user = { userId: payload._id, name: payload.name, role: payload.role }
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