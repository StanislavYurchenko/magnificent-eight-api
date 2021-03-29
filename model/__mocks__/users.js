const bcrypt = require('bcryptjs')
const { users } = require('./data')
const { SALT_FACTOR } = require('../../utils/constants')


const findUserByEmail = jest.fn((email) => {
  const [user] = users.filter((user) => String(user.email) === String(email))
  return { data: user }

})

const findUserById = jest.fn((id) => {
  const [user] = users.filter((user) => String(user._id) === String(id))
  return { data: user }
})

const updateToken = jest.fn((id, token) => {
    return {}
})

const register = jest.fn(({name, email, password}) => {
  const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR), null)
  const newUser = {
    name,
    email,
    password: pass,
    _id: '60513a347039433f64247981',
    validPassword: function (pass) {
      return bcrypt.compareSync(pass, this.password)
    },
  }
  users.push(newUser)
  return { data: newUser }
})

const login = jest.fn((body) => {
  return {}
})

const logout = jest.fn((id) => {
  return {}
})

const updateUserById = jest.fn((id, body) => {
  return {}
})

const updateAvatar = jest.fn((id, avatar) => {
  return {}
})

module.exports = {
  findUserByEmail,
  register,
  login,
  logout,
  updateToken,
  findUserById,
  updateUserById,
  updateAvatar,
}
