const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const testsSchema = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
    },
    questionId: {
      type: Number,
      required: [true, 'QuestionID is required'],
      unique: true,
    },
    answers: {
      type: [String],
      required: [true, 'Answers is required'],
    },
    rightAnswer: {
      type: String,
      required: [true, 'Right answer is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

const QATestTheory = model('theory-test', testsSchema);

module.exports = QATestTheory;
