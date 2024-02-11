const BasketItem = require('../models/BasketItem')
const { StatusCodes } = require('http-status-codes')


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
    const basketItems = await BasketItem.find({ userId: userId }).populate('productId', 'name salePrice , images');
    let totalAmount = 0
     basketItems.forEach((item) => {
        totalAmount += item.productId.salePrice * item.count
    })
    res.status(StatusCodes.OK).json({basketItems,totalAmount})
}





module.exports = {addBasketItem,getAllBasketItems}
