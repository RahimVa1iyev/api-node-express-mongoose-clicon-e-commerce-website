const express = require('express')
const router = express.Router()

const {login,register,logout,verifyEmail} = require('../controllers/authController')
const {authenticateUser} = require('../middlewares/authentication')

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/logout').delete(authenticateUser,logout)
router.route('/verify-email').post(verifyEmail)


module.exports = router