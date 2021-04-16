const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

const { Schema, model } = mongoose;
const {
  SUBSCRIPTIONS_TYPE,
  SALT_FACTOR,
  ROLE,
} = require('../../utils/constants');

const usersSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: [true, 'Input user name'],
    },
    email: {
      type: String,
      required: [true, 'Email is require'],
      unique: true,
      validate(value) {
        const isValidEmail = /\S+@\S+\.\S+/.test(String(value));
        return isValidEmail;
      },
    },
    password: {
      type: String,
      required: [true, 'Password is require'],
    },
    subscription: {
      type: String,
      enum: {
        values: Object.values(SUBSCRIPTIONS_TYPE),
        message: 'It is not allowed',
      },
      default: SUBSCRIPTIONS_TYPE.free,
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: 250 }, true);
      },
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLE),
        message: 'It is not allowed',
      },
      default: ROLE.STUDENT,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      require: [true, 'Verify token is require'],
    },
    token: {
      accessToken: { type: String, default: null },
      refreshToken: {
        type: String,
        default: null,
      },
    },
    onlyGoogleRegister: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true },
);

usersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, SALT_FACTOR);
  next();
});

usersSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', usersSchema);

module.exports = User;
