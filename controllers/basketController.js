const BasketItem = require('../models/BasketItem')
const { StatusCodes } = require('http-status-codes')
const { calculatePercent } = require('../utils')
const Product = require('../models/Product')
const User = require('../models/User')


const addBasketItem = async (req, res) => {
    const { productId, count } = req.body
    const { userId } = req.user

    const basketItem = await BasketItem.findOne({ userId, productId });
    const product = await Product.findOne({ _id: productId })
    const user = await User.findOne({ _id: userId })
    if (!basketItem) {
        const newBasketItem = await BasketItem.create({ userId, productId, count })
        product.basketItems.push(newBasketItem._id)
        user.basketItems.push(newBasketItem._id)
        await product.save()
        await user.save()
    }
    else {
        basketItem.count += count
        await basketItem.save()
    }


    res.status(StatusCodes.CREATED).json({})
}

const deleteBasketItem = async (req, res) => {
    const { basketItemId } = req.params;

    // BasketItem'i bul ve sil
    const basketItem = await BasketItem.findByIdAndDelete(basketItemId);
    if (!basketItem) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Basket item not found" });
    }

    // Product'tan ilişkili BasketItem'i kaldır
    const product = await Product.findById(basketItem.productId);
    const user = await User.findById(basketItem.userId)

    if (product) {
        product.basketItems.pull(basketItemId); // İlişkili BasketItem'in id'sini çıkar
        await product.save(); // Değişiklikleri kaydet
    }

    if (user) {
        user.basketItems.pull(basketItemId); // İlişkili BasketItem'in id'sini çıkar
        await user.save(); // Değişiklikleri kaydet
    }
    res.status(StatusCodes.OK).json({ message: "Basket item deleted successfully" });
}


const getAllBasketItems = async (req, res) => {
    const { userId } = req.user
    const basketItems = await BasketItem.find({ userId: userId }).populate('productId', 'name salePrice discountPercent bestDiscountPercent images');
    let totalAmount = 0
    basketItems.forEach((item) => {
        const { salePrice, discountPercent, bestDiscountPercent } = item.productId
        const calculatedPercent = discountPercent ? calculatePercent(salePrice, discountPercent) : calculatePercent(salePrice, bestDiscountPercent)
        totalAmount += calculatedPercent * item.count
    })
    res.status(StatusCodes.OK).json({ basketItems, totalAmount })
}





module.exports = { addBasketItem, getAllBasketItems, deleteBasketItem }
