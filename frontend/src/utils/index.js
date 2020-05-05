export const evaluateAnswer = (guess, currentQuestion) => {
  const formatGuess = guess
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .toLowerCase();
  const answer = currentQuestion.answer.toLowerCase();
  currentQuestion.answer.toLowerCase();
  const answerArray = answer.split(' ');

  return answerArray.includes(formatGuess) || formatGuess === answer;
};
