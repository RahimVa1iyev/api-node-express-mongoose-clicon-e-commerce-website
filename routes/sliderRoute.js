const express = require('express')
const router = express.Router()
const {createSlider,updateSlider,getSliders,deleteSlider} = require('../controllers/sliderController')

router.route('/').get(getSliders).post(createSlider)
router.route('/:id').patch(updateSlider).delete(deleteSlider)

module.exports = router