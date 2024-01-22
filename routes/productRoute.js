const express = require('express')
const router = express.Router()

const {uploadImage , createProduct,getAllProducts,getBestDealsProducts,getFeaturedProducts,getBestSellerProducts,getMostViewProducts } = require('../controllers/productController')
 
const {authenticateUser,authorizePermission} = require('../middlewares/authentication')


router.route('/').post(createProduct).get(getAllProducts)
router.route('/uploadImage/:productId').post(uploadImage)
router.route('/best-deals').get(getBestDealsProducts)
router.route('/featured-products').get(getFeaturedProducts)
router.route('/best-seller-products').get(getBestSellerProducts)
router.route('/most-view-products').get(getMostViewProducts)

module.exports = router