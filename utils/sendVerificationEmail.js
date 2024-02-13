const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({name,email, verificationToken,origin}) => {
    const verifyEmail  = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`

    const message =`<p4>Please confirm your email by clicking on the following link : <a href="${verifyEmail}" >Verify Email</a> </p4>`
    return sendEmail({
        to : email,
        subject : 'Email Confirmation',
        html : `<h4> Hello , ${name} </h4>
        ${message}
        `
    })
}

module.exports = sendVerificationEmail