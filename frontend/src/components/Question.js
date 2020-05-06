import React, { useState } from 'react';
import '../stylesheets/Question.css';
import Button from './Button';

const Question = (props) => {
  const { question, answer, category, difficulty, id, questionAction } = props;
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className='Question-holder'>
      <div className='Question'>{question}</div>
      <div className='Question-status'>
        <img className='category' src={`assets/${category}.svg`} />
        <div className='difficulty'>Difficulty: {difficulty}</div>
        <img
          src='assets/delete.png'
          className='delete'
          onClick={() => questionAction(id)}
        />
      </div>
      <Button
        type='button'
        className='show-answer button'
        onClick={toggleAnswer}
        text={`${showAnswer ? 'Hide' : 'Show'} Answer`}
      />
      {showAnswer && (
        <div className='answer-holder'>
          <span>Answer: {answer}</span>
        </div>
      )}
    </div>
  );
};

export default Question;
