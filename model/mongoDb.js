const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const uri = process.env.DB_URL
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  promiseLibrary: global.Promise,
  useCreateIndex: true,
  useFindAndModify: false,
  returnOriginal: false,

}

const dbConnect = async (callback) => {
  try {
    mongoose.connect(uri, options)
    const db = mongoose.connection
    db.on('connected', () => {
      console.log('<<< Connected to mongoDB >>>')
      return callback()
    })
    db.on('disconnected', () => console.log('<<< Disconnected from mongoDB >>>'))
    db.on('error', console.error.bind(console, 'connection error:'))

    process.on('SIGINT', async () => {
      db.close(() => {
        console.log('Connection om MondoDb closed and app termination')
        process.exit(1)
      })
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = dbConnect
