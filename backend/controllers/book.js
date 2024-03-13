const Book = require('../models/book.js')
const Rating = require('../models/rating.js')
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
            res.status(200).json(book)
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            })
        })
}

exports.getBestRating = (req, res, next) => {
    Book.find()
        .then((books) => {
            // Sorting in descending order
            books.sort((a, b) => b.averageRating - a.averageRating)
            // Getting the 3 first elements (best rated)
            const bestRatedBooks = books.slice(0, 3)
            // Sending the array
            res.status(200).json(bestRatedBooks)
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

exports.createRating = (req, res, next) => {
    const ratingObject = JSON.parse(req.body.rating)
    delete ratingObject._userId
    const rating = new Rating({
        userId: req.auth.userId,
        grade: ratingObject,
    })
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            const newRatings = [...book.ratings, rating]
            let newAverageRating =
                newRatings.reduce((total, next) => total + next.grade, 0) /
                newRatings.length
            newAverageRating = Math.floor(newAverageRating * 100) / 100
            Book.updateOne(
                { _id: req.params.id },
                {
                    ratings: newRatings,
                    averageRating: newAverageRating,
                    _id: req.params.id,
                }
            )
                .then(() => {
                    Book.findOne({ _id: req.params.id }).then((book) => {
                        res.status(200).json(book)
                    })
                })
                .catch((error) => res.status(401).json({ error }))
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
                res.status(401).json({ message: 'Not authorized' })
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: 'Book modified!' })
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
                res.status(401).json({ message: 'Not authorized' })
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
