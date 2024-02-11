const express =require('express')

const router = express.Router()

const {addBasketItem,getAllBasketItems} = require('../controllers/basketController')
const {authenticateUser} = require('../middlewares/authentication')


router.route('/').post(authenticateUser,addBasketItem).get(authenticateUser,getAllBasketItems)

module.exports = router