const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')

const { Schema } = mongoose
const { SUBSCRIPTIONS_TYPE, SALT_FACTOR } = require('../../utils/constants')

const usersSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is require'],
    unique: true,
    validate(value) {
      const isValidEmail = /\S+@\S+\.\S+/.test(String(value))
      return isValidEmail
    }
  },
  password: {
    type: String,
    required: [true, 'Password is require'],
  },
  subscription: {
    type: String,
    enum: {
      values: Object.values(SUBSCRIPTIONS_TYPE),
      message: 'It is not allowed'
    },
    default: SUBSCRIPTIONS_TYPE.free
  },
  token: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: function () {
      return gravatar.profile_url(this.email, { s: 250 }, true)
    }
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    require: [true, 'Verify token is require']
  },
}, { versionKey: false, timestamps: true })

usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, SALT_FACTOR)
  next()
})

usersSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('user', usersSchema)

module.exports = User
