const express = require('express')
const router = express.Router()

const {uploadImage , createProduct} = require('../controllers/productController')
 
const {authenticateUser,authorizePermission} = require('../middlewares/authentication')


router.route('/').post(createProduct)
router.route('/uploadImage/:productId').post(uploadImage)


module.exports = router