const BasketItem = require('../models/BasketItem')
const { StatusCodes } = require('http-status-codes')
const { calculatePercent } = require('../utils')


const addBasketItem = async (req,res) =>{
   const {productId , count}  = req.body 
   const {userId} = req.user
   
   const basketItem = await BasketItem.findOne({ userId, productId });
  console.log(basketItem);   

   if(!basketItem){
      await BasketItem.create({userId , productId , count})
   }
   else{
       basketItem.count += count
   }
   await basketItem.save()

   res.status(StatusCodes.CREATED).json({})
}

const getAllBasketItems = async (req,res) =>{
    const {userId} = req.user
    const basketItems = await BasketItem.find({ userId: userId }).populate('productId', 'name salePrice discountPercent bestDiscountPercent images');
    let totalAmount = 0
     basketItems.forEach((item) => {
        const {salePrice,discountPercent,bestDiscountPercent} = item.productId
        const calculatedPercent = discountPercent ? calculatePercent(salePrice,discountPercent) : calculatePercent(salePrice,bestDiscountPercent)
        totalAmount += calculatedPercent * item.count
    })
    res.status(StatusCodes.OK).json({basketItems,totalAmount})
}





module.exports = {addBasketItem,getAllBasketItems}
