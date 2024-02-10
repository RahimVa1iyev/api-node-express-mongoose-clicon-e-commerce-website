const express = require('express')
const router = express.Router()

const {uploadImage , createProduct,getAllProducts,getBestDealsProducts,getFeaturedProducts,topRatedProducts,filterProductsInDetail,getBestSellerProducts,getMostViewProducts,getProductById,filterAndSortProducts } = require('../controllers/productController')
 
const {authenticateUser,authorizePermission} = require('../middlewares/authentication')


router.route('/').post(createProduct).get(getAllProducts)
router.route('/:id').get(getProductById)
router.route('/uploadImage/:productId').post(uploadImage)
router.route('/best/deals').get(getBestDealsProducts)
router.route('/featured/products').get(getFeaturedProducts)
router.route('/best-seller/products').get(getBestSellerProducts)
router.route('/most-view/products').get(getMostViewProducts)
router.route('/shop/filter-sort').get(filterAndSortProducts)
router.route('/top-rated/products').get(topRatedProducts)
router.route('/detail/:seriaNo').get(filterProductsInDetail)

module.exports = router
