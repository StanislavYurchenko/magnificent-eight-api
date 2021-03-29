const fs = require('fs/promises')

const isAccessible = async (path) => {
  return await fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const createDirIfIsNotExist = async (dir) => {
  if (!(await isAccessible(dir))) {
    await fs.mkdir(dir)
  }
}

module.exports = {
  createDirIfIsNotExist
}
