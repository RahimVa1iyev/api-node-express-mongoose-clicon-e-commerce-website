const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
    const token = jst.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE_TIME })
    return token
}

const isVerifyToken = ({ token }) => { return jwt.verify(token, process.env.JWT_SECRET) }


const attachCookiesToResponse = ({res,user}) =>{
    const token = createJWT({payload:user})

    const oneDay = 1000 * 60 * 60 * 24

    res.cookies =('token',token,{
        httpOnly : true,
        expiresIn : new Date(Date.now() + oneDay),
        signed: true,
        secure: process.env.NODE_ENV === 'production'
    })
}