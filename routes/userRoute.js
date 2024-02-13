const express = require('express')
const router = express.Router()
const {getAllUsers,getUser,getCurrentUser,updateMe} = require('../controllers/userController')

const {authenticateUser,authorizePermission} = require('../middlewares/authentication')

router.route('/update/me').patch(authenticateUser,updateMe)
router.route('/').get(authenticateUser ,getAllUsers)
router.route('/me').get(authenticateUser,getCurrentUser)
router.route('/:id').get(authenticateUser,authorizePermission('admin'),getUser)


module.exports = router