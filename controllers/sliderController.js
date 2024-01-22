const Slider = require('../models/Slider')
const {StatusCodes} = require('http-status-codes')
const upload = require('../utils/upload')


const createSlider = async (req,res) =>{
  const {headTitle,title,status,price,btnUrl} = req.body
  let {image} = req.files
  let slider

  if(!status) {
    slider = await Slider.create({headTitle,title,image,status,price,btnUrl})
  }
  else{
    slider = await Slider.create(req.body)
  }

  let result = await upload(image)
  slider.image = result.secure_url
  slider.save()

  res.status(StatusCodes.CREATED).json({slider})
}



const getSliders = async (req,res) =>{
    const sliders = await Slider.find({}).sort({order:'asc'})
    res.status(StatusCodes.OK).json({sliders})
}

const updateSlider = async (req,res) =>{
    
}

const deleteSlider = async (req,res) =>{
    
}


module.exports = {createSlider,updateSlider,getSliders,deleteSlider}