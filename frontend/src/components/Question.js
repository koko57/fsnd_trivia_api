import React, { useState } from 'react';
import '../stylesheets/Question.css';

const Question = (props) => {
  const { question, answer, category, difficulty, questionAction } = props;
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className='Question-holder'>
      <div className='Question'>{question}</div>
      <div className='Question-status'>
        <img className='category' src={`${category}.svg`} />
        <div className='difficulty'>Difficulty: {difficulty}</div>
        <img
          src='delete.png'
          className='delete'
          onClick={() => questionAction('DELETE')}
        />
      </div>
      <button
        type='button'
        className='show-answer button'
        onClick={toggleAnswer}
      >
        {showAnswer ? 'Hide' : 'Show'} Answer
      </button>
      {showAnswer && (
        <div className='answer-holder'>
          <span>Answer: {answer}</span>
        </div>
      )}
    </div>
  );
};

export default Question;
