const express = require('express')
const router = express.Router()
const {getAllUsers,getUser,getCurrentUser,updateUser} = require('../controllers/userController')

const {authenticateUser,authorizePermission} = require('../middlewares/authentication')


router.route('/').get(authenticateUser ,getAllUsers)

router.route('/current-user').get(authenticateUser,getCurrentUser)

router.route('/update-user').patch(authenticateUser,updateUser)

router.route('/:id').get(authenticateUser,authorizePermission('admin'),getUser)


module.exports = router