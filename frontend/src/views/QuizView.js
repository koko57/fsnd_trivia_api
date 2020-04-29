import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../config';

import '../stylesheets/QuizView.css';
import ChooseCategory from '../components/ChooseCategory';

const { BASE_URL } = config;

const questionsPerPlay = 5;

class QuizView extends Component {
  constructor(props) {
    super();
    this.state = {
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      categories: [],
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      lastQuestion: false,
      endGame: false,
    };
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get(`${BASE_URL}/categories`);
      this.setState({ categories: data.categories });
    } catch (error) {
      //TODO: error handling
      console.log(error);
    }
  }

  selectCategory = ({ type, id = 0 }) => {
    this.setState({ quizCategory: { type, id } }, this.getNextQuestion);
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getNextQuestion = async () => {
    if (!this.state.lastQuestion) {
      const previousQuestions = [...this.state.previousQuestions];
      if (this.state.currentQuestion.id) {
        previousQuestions.push(this.state.currentQuestion.id);
      }
      if (previousQuestions.length === 5) {
        this.setState({ endGame: true });
      }
      try {
        const { data } = await axios.post(`${BASE_URL}/quizzes`, {
          previous_questions: previousQuestions,
          quiz_category: this.state.quizCategory.id,
        });
        this.setState({
          showAnswer: false,
          previousQuestions: previousQuestions,
          currentQuestion: data.question,
          lastQuestion: data.last_question,
          guess: '',
        });
      } catch (error) {
        //TODO: error handling
        console.log(error);
      }
    } else {
      this.setState({ endGame: true });
    }
  };

  submitGuess = (event) => {
    event.preventDefault();
    const formatGuess = this.state.guess
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    let evaluate = this.evaluateAnswer();
    this.setState({
      numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
      showAnswer: true,
    });
  };

  restartGame = () => {
    this.setState({
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      lastQuestion: false,
      endGame: false,
    });
  };

  renderPrePlay() {
    return (
      <ChooseCategory
        categories={this.state.categories}
        selectCategory={this.selectCategory}
      />
    );
  }

  renderFinalScore() {
    return (
      <div className='quiz-play-holder'>
        <div className='final-header'>
          Your Final Score is {this.state.numCorrect}
        </div>
        <button
          type='button'
          className='play-again button'
          onClick={this.restartGame}
        >
          Play Again?
        </button>
      </div>
    );
  }

  evaluateAnswer = () => {
    const formatGuess = this.state.guess
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    const answerArray = this.state.currentQuestion.answer
      .toLowerCase()
      .split(' ');
    return answerArray.includes(formatGuess);
  };

  renderCorrectAnswer() {
    const formatGuess = this.state.guess
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    let evaluate = this.evaluateAnswer();
    return (
      <div className='quiz-play-holder'>
        <div className='quiz-question'>
          {this.state.currentQuestion.question}
        </div>
        <div className={`${evaluate ? 'correct' : 'wrong'}`}>
          {evaluate ? 'You were correct!' : 'You were incorrect'}
        </div>
        <div className='quiz-answer'>{this.state.currentQuestion.answer}</div>
        <button
          type='button'
          className='next-question button'
          onClick={this.getNextQuestion}
        >
          Next Question
        </button>
      </div>
    );
  }

  renderPlay() {
    return this.state.previousQuestions.length === questionsPerPlay ||
      this.state.endGame ? (
      this.renderFinalScore()
    ) : this.state.showAnswer ? (
      this.renderCorrectAnswer()
    ) : (
      <div className='quiz-play-holder'>
        <div className='quiz-question'>
          {this.state.currentQuestion.question}
        </div>
        <form onSubmit={this.submitGuess}>
          <input type='text' name='guess' onChange={this.handleChange} />
          <input
            className='submit-guess button'
            type='submit'
            value='Submit Answer'
          />
        </form>
      </div>
    );
  }

  render() {
    return this.state.quizCategory ? this.renderPlay() : this.renderPrePlay();
  }
}

export default QuizView;
