const express =require('express')
const router = express.Router()

const {createReview , getAllReviews} = require('../controllers/reviewController')
const {authenticateUser} =require('../middlewares/authentication')

router.route('/:id').post(authenticateUser,createReview)
router.route('/').get(getAllReviews)
module.exports = router