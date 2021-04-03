const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const testsSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    questionId: {
      type: Number,
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    },
    rightAnswer: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const QATest = model('tech', testsSchema);

module.exports = QATest;
