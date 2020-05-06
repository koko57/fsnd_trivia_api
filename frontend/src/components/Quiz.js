import React from 'react';
import Button from './Button';

const questionsPerPlay = 5;

const Quiz = (props) => {
  const {
    previousQuestions,
    endGame,
    numCorrect,
    showAnswer,
    currentQuestion,
    correct,
    submitGuess,
    getNextQuestion,
    handleChange,
    restartGame,
  } = props;

  return previousQuestions.length === questionsPerPlay || endGame ? (
    <div className='quiz-play-holder'>
      <div className='final-header'>Your Final Score is {numCorrect}</div>
      <Button type='button' onClick={restartGame} text='Play Again?' />
    </div>
  ) : (
    <div className='quiz-play-holder'>
      <div className='quiz-question'>{currentQuestion.question}</div>
      {showAnswer ? (
        <>
          <div className={`${correct ? 'correct' : 'wrong'}`}>
            {correct ? 'You were correct!' : 'You were incorrect'}
          </div>
          <div className='quiz-answer'>{currentQuestion.answer}</div>
          <Button
            type='button'
            onClick={getNextQuestion}
            text='Next Question'
          />
        </>
      ) : (
        <form onSubmit={submitGuess}>
          <input type='text' name='guess' onChange={handleChange} />
          <Button
            className='submit-guess button'
            type='submit'
            text='Submit Answer'
          />
        </form>
      )}
    </div>
  );
};

export default Quiz;
