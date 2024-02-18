const express =require('express')

const router = express.Router()

const {addBasketItem,getAllBasketItems,deleteBasketItem} = require('../controllers/basketController')
const {authenticateUser} = require('../middlewares/authentication')


router.route('/').post(authenticateUser,addBasketItem).get(authenticateUser,getAllBasketItems)
router.route('/:basketItemId').delete(deleteBasketItem)

module.exports = router