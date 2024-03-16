const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const sharp = require('../middleware/sharp')

const bookCtrl = require('../controllers/book')

// Unauthentified routes
// GET
router.get('/', bookCtrl.getAllBooks) // Working !
router.get('/bestrating', bookCtrl.getBestRating) // Working !
router.get('/:id', bookCtrl.getOneBook) // Working !

// Authentified routes
// POST
router.post('/', auth, multer, sharp, bookCtrl.createBook) // Working !
router.post('/:id/rating', auth, bookCtrl.createRating) // Working !
// // PUT
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook) // Working !
// // DELETE
router.delete('/:id', auth, bookCtrl.deleteBook) // Working !

module.exports = router
