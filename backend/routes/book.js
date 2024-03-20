const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharp = require('../middleware/sharp')

const bookCtrl = require('../controllers/book')
const ratingCtrl = require('../controllers/rating')

// Unauthentified routes
// GET
router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', ratingCtrl.getBestRating)
router.get('/:id', bookCtrl.getOneBook)

// Authentified routes
// POST
router.post('/', auth, multer, sharp, bookCtrl.createBook)
router.post('/:id/rating', auth, ratingCtrl.createRating)
// // PUT
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook)
// // DELETE
router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router
