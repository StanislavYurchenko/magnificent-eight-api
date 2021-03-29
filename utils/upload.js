const multer = require('multer')

const { DIRS, MAX_UPLOAD_FILE_SIZE } = require('./constants')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIRS.upload)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
  limits: {
    fileSize: 1048576,
  },
})

const multerConfig = {
  storage,
  limits: {
    fileSize: MAX_UPLOAD_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    const isFileImage = file.mimetype.includes('image')

    return cb(null, isFileImage)
  },
}
const upload = multer(multerConfig)

module.exports = upload
