const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = async ({name , email , token , origin}) => {
    const resetUrl  = `${origin}/user/reset-password?token=${token}&email=${email}`

    const message =`<p4>Please reset your password by clicking on the following link : <a href="${resetUrl}" >Verify Email</a> </p4>`
    return sendEmail({
        to : email,
        subject : 'Reset Password',
        html : `<h4> Hello , ${name} </h4>
        ${message}
        `
    })
}

module.exports = sendResetPasswordEmail