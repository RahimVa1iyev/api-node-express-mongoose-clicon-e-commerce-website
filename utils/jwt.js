const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return token
}

const verifyToken = ( token ) => { return jwt.verify(token, process.env.JWT_SECRET) }


const attachCookiesToResponse = ({ res, user, refreshToken }) => {
    const accessTokenJwt = createJWT({ payload: { user } })
    const refreshTokenJWT = createJWT({ payload: { user, refreshToken } })



    const shorterExp = 1000 * 60 * 60 * 24 * 30
    const longerExp = 100 * 60 * 60 * 24 * 30

        res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + longerExp)
    })

    res.cookie('accessToken', accessTokenJwt, {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + shorterExp )
    })

    return {accessTokenJwt , refreshTokenJWT}

}

module.exports = { createJWT, verifyToken, attachCookiesToResponse }