const Feature = require('../models/Feature')
const {StatusCodes} = require('http-status-codes')

const createFeature = async (req,res) =>{
    const feature = await Feature.create(req.body)
    res.status(StatusCodes.CREATED).json({feature})
}

const getFeatures = async (req,res) =>{
    const features = await Feature.find({})
    res.status(StatusCodes.OK).json({features})
}

module.exports = {getFeatures,createFeature}