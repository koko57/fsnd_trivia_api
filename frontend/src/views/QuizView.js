import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../config';

import '../stylesheets/QuizView.css';
import ChooseCategory from '../components/ChooseCategory';
import Quiz from '../components/Quiz';

const { BASE_URL } = config;

const questionsPerPlay = 5;

class QuizView extends Component {
  constructor(props) {
    super();
    this.state = {
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      correct: false,
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
      correct: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      lastQuestion: false,
      endGame: false,
    });
  };

  // TODO refactor this function
  evaluateAnswer = () => {
    const formatGuess = this.state.guess
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    const answerArray = this.state.currentQuestion.answer
      .toLowerCase()
      .split(' ');
    this.setState({ correct: answerArray.includes(formatGuess) });
  };

  render() {
    return this.state.quizCategory ? (
      <Quiz
        previousQuestions={this.state.previousQuestions}
        endGame={this.state.endGame}
        numCorrect={this.state.numCorrect}
        showAnswer={this.state.showAnswer}
        correct={this.state.correct}
        currentQuestion={this.state.currentQuestion}
        handleChange={this.handleChange}
        getNextQuestion={this.getNextQuestion}
        submitGuess={this.submitGuess}
        restartGame={this.restartGame}
      />
    ) : (
      <ChooseCategory
        categories={this.state.categories}
        selectCategory={this.selectCategory}
      />
    );
  }
}

export default QuizView;
