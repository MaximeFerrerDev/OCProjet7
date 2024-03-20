const Book = require('../models/book.js')
const fs = require('fs')

// GET
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => {
            res.status(200).json(books)
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            })
        })
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id,
    })
        .then((book) => {
            if (book) {
                res.status(200).json(book)
            } else {
                res.status(404).json({ error: 'Book not found' })
            }
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            })
        })
}

// POST
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject._userId
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    })

    book.save()
        .then(() => {
            res.status(201).json({ message: 'Book created!' })
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

// PUT
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body }
    delete bookObject._userId

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ error: 'Unauthorized request' })
            } else {
                // If the modification changed the image, deleting the old one
                if (bookObject.imageUrl) {
                    const filename = book.imageUrl.split('/images/')[1]
                    fs.unlink(`images/${filename}`, (error) => {
                        if (error) throw error
                    })
                }
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ error: 'Book modified!' })
                    )
                    .catch((error) => res.status(401).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

// DELETE
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ error: 'Unauthorized request' })
            } else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'Book deleted !',
                            })
                        })
                        .catch((error) => res.status(401).json({ error }))
                })
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}
