import React from 'react';

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
    restartGame
  } = props;

  return previousQuestions.length === questionsPerPlay || endGame ? (
    <div className='quiz-play-holder'>
      <div className='final-header'>Your Final Score is {numCorrect}</div>
      <button
        type='button'
        className='play-again button'
        onClick={restartGame}
      >
        Play Again?
      </button>
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
          <button
            type='button'
            className='next-question button'
            onClick={getNextQuestion}
          >
            Next Question
          </button>
        </>
      ) : (
        <form onSubmit={submitGuess}>
          <input type='text' name='guess' onChange={handleChange} />
          <input
            className='submit-guess button'
            type='submit'
            value='Submit Answer'
          />
        </form>
      )}
    </div>
  );
};

export default Quiz;
