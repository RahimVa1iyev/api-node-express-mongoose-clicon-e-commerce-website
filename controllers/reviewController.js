const Review = require('../models/Review')
const Product = require('../models/Product')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');


const createReview = async (req, res) => {
    const { id: productId } = req.params
    const { userId } = req.user
    const data = {}

    if (!productId && !userId) throw new NotFoundError('ProductId and UserId not found')

    const existReview = await Review.findOne({ product: productId, user: userId })
    if (existReview) throw new BadRequestError('You already have your review')

    const product = await Product.findOne({ _id: productId }).populate('reviews', 'rate')
    if (!product) throw new NotFoundError(`Product not found by id :${productId}`)
    data.user = userId
    data.product = productId
    data.createdAt = Date.now()

    const review = await Review.create({ ...data, ...req.body })

    const totalRates = (product.reviews.reduce((sum, review) => sum + review.rate, 0)) + req.body.rate;
    const averageRating = totalRates / (product.reviews.length + 1);

    product.rate = Math.ceil(averageRating);

    product.reviews.push(review._id);

    await product.save();

    res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
    const { id: productId } = req.params

    const reviews = await Review.find({product:productId}).populate('user')

    res.status(StatusCodes.OK).json({reviews})
}

module.exports = { createReview, getAllReviews }