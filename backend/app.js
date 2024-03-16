const express = require('express')

const path = require('path')

const app = express()

const mongoose = require('mongoose')
mongoose
    .connect(process.env.DATABASE_SRV_ADDRESS)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'))

const userRoutes = require('./routes/user')
const bookRoutes = require('./routes/book')

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )

    next()
})

app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

app.options('/*', (_, res) => {
    res.sendStatus(200)
})

module.exports = app
