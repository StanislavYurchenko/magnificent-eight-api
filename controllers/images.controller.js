const fs = require('fs/promises')
const path = require('path')
const Jimp = require('jimp')
const usersModel = require('../model/users')
const { createResponse } = require('../utils/createResponse')
const { HTTP_CODE, DIRS } = require('../utils/constants')
const { createDirIfIsNotExist } = require('../utils/createDir')

const uploadImage = async (req, res, next) => {
  const userId = req.user._id
  try {
    const imageUrl = await saveImageToStatic(req)

    const { data, error } = await usersModel.updateAvatar(userId, imageUrl)

    const code = data ? HTTP_CODE.OK : HTTP_CODE.BAD_CONTENT
    const user = data
      ? {
          avatar: imageUrl,
        }
      : undefined
    return createResponse(res, user, error, code)
  } catch (error) {
    next(error)
  }
}

const saveImageToStatic = async (req) => {
  const userId = String(req.user._id)
  const avatarDir = DIRS.avatar
  const pathFile = req.file.path
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`
  const img = await Jimp.read(pathFile)

  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile)

  await createDirIfIsNotExist(path.join(avatarDir, userId))
  await fs.rename(pathFile, path.join(avatarDir, userId, newNameAvatar))
  const avatarUrl = path.normalize(path.join(userId, newNameAvatar))

  try {
    await fs.unlink(path.join(avatarDir, req.user.avatar))
  } catch (e) {
    console.log(e.message)
  }
  return avatarUrl
}

module.exports = {
  uploadImage,
}
