const multer = require('multer')

// Simply saving the image in the buffer to be used by sharp next
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

module.exports = upload.single('image')
