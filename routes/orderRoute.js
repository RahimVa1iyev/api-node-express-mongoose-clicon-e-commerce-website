const express = require('express')
const router = express.Router()

const {createOrder,getOrdersByUserId,updateOrderStatus} = require('../controllers/orderController')
const {authenticateUser} = require('../middlewares/authentication')

router.route('/').post(authenticateUser,createOrder).get(authenticateUser,getOrdersByUserId)
router.route('/:orderId').patch(updateOrderStatus)


module.exports = router