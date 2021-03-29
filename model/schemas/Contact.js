const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const bcrypt = require('bcryptjs')
const { Schema, SchemaTypes } = mongoose

const { SUBSCRIPTIONS_TYPE, SALT_FACTOR } = require('../../utils/constants')

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Email is require'],
    unique: true,
    validate(value) {
      const isValidEmail = /\S+@\S+\.\S+/.test(String(value))
      return isValidEmail
    }
  },
  phone: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: {
      values: Object.values(SUBSCRIPTIONS_TYPE),
      message: 'It is not allowed'
    },
    default: SUBSCRIPTIONS_TYPE.free
  },
  password: {
    type: String,
    required: [true, 'Password is require'],
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  }
}, { versionKey: false, timestamps: true })

contactSchema.plugin(mongoosePaginate)

contactSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, SALT_FACTOR)
  next()
})

contactSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const Contact = mongoose.model('contact', contactSchema)

module.exports = Contact
