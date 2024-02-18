const BasketItem = require('../models/BasketItem');
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const { StatusCodes } = require('http-status-codes');
const { calculatePercent } = require('../utils');
const User = require('../models/User');

const createOrder = async (req, res) => {
    const basketItems = await BasketItem.find({ userId: req.user.userId }).populate('productId', 'salePrice costPrice discountPercent bestDiscountPercent')

    const order = await Order.create({ ...req.body, userId: req.user.userId, createdAt: Date.now()})
    const user = await User.findOne({_id : req.user.userId})
    user.orders.push(order._id)

    for (const item of basketItems) {
        const { _id, salePrice, costPrice, discountPercent, bestDiscountPercent } = item.productId
        const calculatedPercent = discountPercent ? calculatePercent(salePrice, discountPercent) : calculatePercent(salePrice, bestDiscountPercent)
        const newOrderItem = await OrderItem
            .create({
                productId: _id,
                orderId: order._id,
                count: item.count,
                unitSalePrice: salePrice,
                unitCostPrice: costPrice,
                unitDiscountedPrice: calculatedPercent
            })
        order.totalAmount += calculatedPercent * item.count
        order.orderItems.push(newOrderItem)
    }

    await order.save()
    await user.save()

    res.status(StatusCodes.CREATED).json({ id: order._id })
}

const getOrdersByUserId = async (req, res) => {
    const orders = await Order.find({ userId: req.user.userId })
        .select('_id totalAmount createdAt orderStatus orderItems')
        .populate({
            path: 'orderItems',
            populate: {
                path: 'productId',
                select: 'name salePrice images'
            }
        });
    res.status(StatusCodes.OK).json({ orders })
}

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { orderStatus } = req.body

    const order = await Order.findByIdAndUpdate(orderId, orderStatus, { new: true, runValidators: true })
        .populate({
            path: 'orderItems',
            populate: {
                path: 'productId',
                select: 'name salePrice images'
            }
        });

    if (orderStatus === 'delivered') {
        for (const orderItem of order.orderItems) {
            await orderItem.populate('productId', 'sellerCount');
            orderItem.productId.sellerCount +=1
        }
    }

    res.status(StatusCodes.OK).json({})
}



module.exports = { createOrder, getOrdersByUserId, updateOrderStatus }