import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../config';
import '../stylesheets/FormView.css';

const { BASE_URL } = config;

class FormView extends Component {
  constructor(props) {
    super();
    this.state = {
      question: '',
      answer: '',
      difficulty: 1,
      category: 1,
      categories: [],
      error: '',
    };
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get(`${BASE_URL}/categories`);
      this.setState({ categories: data.categories });
      
    } catch (error) {
      this.setState({ error });
    }
  }

  submitQuestion = async (event) => {
    event.preventDefault();
    const body = {
        question: this.state.question,
        answer: this.state.answer,
        difficulty: this.state.difficulty,
        category: this.state.category,
      } 
    try {
      await axios.post(`${BASE_URL}/questions`, body);
    } catch (error) {
      this.setState({ error });
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div id='add-form'>
        <h2>Add a New Trivia Question</h2>
        <form
          className='form-view'
          id='add-question-form'
          onSubmit={this.submitQuestion}
        >
          <label>
            <span>Question</span>
            <input type='text' name='question' onChange={this.handleChange} />
          </label>
          <label>
            <span>Answer</span>
            <input type='text' name='answer' onChange={this.handleChange} />
          </label>
          <label>
            <span>Difficulty</span>
            <select name='difficulty' onChange={this.handleChange}>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
          </label>
          <label>
            <span>Category</span>
            <select name='category' onChange={this.handleChange}>
              {this.state.categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.type}
                  </option>
                );
              })}
            </select>
          </label>
          <input type='submit' className='button' value='Submit' />
        </form>
      </div>
    );
  }
}

export default FormView;
