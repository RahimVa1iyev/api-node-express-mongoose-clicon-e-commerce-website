const express = require('express')
const router = express.Router()
const {createCategory,getAllCategory} = require('../controllers/categoryController')

const {authenticateUser,authorizePermission} = require('../middlewares/authentication')


router.route('/').post([authenticateUser,authorizePermission('admin')] ,createCategory).get(getAllCategory)




module.exports = router