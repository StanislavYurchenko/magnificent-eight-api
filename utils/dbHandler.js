const getTwelveTests = testsArr => {
  if (testsArr.length < 12) {
    return testsArr.map(el => {
      return {
        questionId: el.questionId,
        question: el.question,
        answers: el.answers,
      };
    });
  }

  const randomIDList = [];
  const min = 1;
  const max = testsArr.length;
  let tempId;

  for (; randomIDList.length < 12; ) {
    tempId = Math.round(Math.random() * (max - min) + min);

    if (!randomIDList.includes(tempId)) {
      randomIDList.push(tempId);
    }
  }

  return testsArr
    .filter(el => randomIDList.includes(el.questionId))
    .map(el => {
      return {
        questionId: el.questionId,
        question: el.question,
        answers: el.answers,
      };
    });
};

const countResult = (userAnswers, testsArr) => {
  let correct = 0;
  let wrong = 0;
  let test;

  userAnswers.forEach(el => {
    test = testsArr.find(test => test.questionId === el.questionId);
    test.rightAnswer === el.answer ? (correct += 1) : (wrong += 1);
  });

  return { correct, wrong };
};

module.exports = { getTwelveTests, countResult };
