const sharp = require('sharp')

module.exports = (req, res, next) => {
    // Getting the image and the name from the buffer
    const { buffer, originalname } = req.file

    // Creating a new reference from the original name
    const name = originalname.split(' ').join('_')
    const timestamp = Date.now()
    const extension = '.webp'
    const ref = name + timestamp + extension

    // Saving the reference in "filename" to be used later
    req.file.filename = ref

    // Saving the converted image
    sharp(buffer)
        .webp({ quality: 80 })
        .toFile('./images/' + ref)

    next()
}
