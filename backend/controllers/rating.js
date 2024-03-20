const Book = require('../models/book.js')
const Rating = require('../models/rating.js')

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

exports.createRating = (req, res, next) => {
    // Getting the new rating object
    const ratingObject = JSON.parse(req.body.rating)
    delete ratingObject._userId
    const rating = new Rating({
        userId: req.auth.userId,
        grade: ratingObject,
    })
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Creating the new ratings array for the book
            const newRatings = [...book.ratings, rating]
            // Computing and rounding up the new average rating
            let newAverageRating =
                newRatings.reduce((total, next) => total + next.grade, 0) /
                newRatings.length
            newAverageRating = Math.floor(newAverageRating * 100) / 100
            // Updating the book with the new rating
            Book.updateOne(
                { _id: req.params.id },
                {
                    ratings: newRatings,
                    averageRating: newAverageRating,
                    _id: req.params.id,
                }
            )
                .then(() => {
                    // Getting the updated book to send it back
                    Book.findOne({ _id: req.params.id }).then((book) => {
                        res.status(201).json(book)
                    })
                })
                .catch((error) => res.status(401).json({ error }))
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}
