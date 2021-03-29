const { nanoid } = require('nanoid')
const User = require('./schemas/User')
const HTTP_CODE = require('../utils/constants')
const EmailService = require('../servises/emailVerify')


const findUserByEmail = async (email) => {
  try {
    return { data: await User.findOne({ email }) }
  } catch (error) {
    return { error }
  }
}

const findUserById = async (id) => {
  try {
    const user = await User.findById(id)
    return { data: user }
  } catch (error) {
    return { error }
  }
}

const updateToken = async (id, token) => {
  try {
    return { data: await User.findByIdAndUpdate(id, { token }) }
  } catch (error) {
    return { error }
  }
}

const register = async (body) => {
  const { email , name} = body
  try {
    const { data } = await findUserByEmail(email)
    const isUserExist = Boolean(data)
    if (isUserExist) {
      const error = new Error()
      error.code = HTTP_CODE.CONFLICT
      error.message = `Email ${body.email} is already exist`
      throw error
    }
    const verifyToken = nanoid()
    const emailService = new EmailService(process.env.NODE_ENV)
    await emailService.sendEmail(verifyToken, email, name)

    const user = new User({...body, verify:false, verifyToken})
    return { data: await user.save() }
  } catch (error) {
    return { error }
  }
}

const login = async (body) => {
  const { email, password } = body
  try {
    const { data } = await findUserByEmail(email)
    const isValidPassword = data ? await data.validPassword(password) : false

    if (!data || !isValidPassword || !data.verify) {
      const error = new Error()
      error.code = HTTP_CODE.NOT_FOUND
      error.message = data.verify ? 'User or password is incorrect' : 'Verify your email'
      throw error
    }
    return { data }
  } catch (error) {
    return { error }
  }
}

const logout = async (id) => {
  try {
    const user = await User.findById(id)
    await updateToken(id, null)
    return { data: user }
  } catch (error) {
    return { error }
  }
}

const updateUserById = async (id, body) => {
  try {
    return { data: await User.findByIdAndUpdate(id, body, { new: true }) }
  } catch (error) {
    return { error }
  }
}

const findByVerifyToken = async (verifyToken) => {
  try {
    return { data: await User.findOne({ verifyToken })}
  } catch (error) {
    return { error }
  }
}

const updateAvatar = async (id, avatar) => {
  try {
    const user = await User.findByIdAndUpdate(id, { avatar })
    return { data: user }
  } catch (error) {
    return { error }
  }
}

const updateVerifyToken = async (id, verify, verifyToken) => {
  try {
    return { data: await User.findByIdAndUpdate(id, { verify, verifyToken }) }
  } catch (error) {
    return { error }
  }
}


module.exports = {
  findUserByEmail,
  register,
  login,
  logout,
  updateToken,
  findUserById,
  updateUserById,
  updateAvatar,
  findByVerifyToken,
  updateVerifyToken,
}
