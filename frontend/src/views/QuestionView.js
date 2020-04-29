import React, { Component } from 'react';
import Question from '../components/Question';
import Pagination from '../components/Pagination';
import $ from 'jquery';
import { config } from '../config';

import '../stylesheets/App.css';
import Categories from '../components/Categories';

const { BASE_URL } = config;

class QuestionView extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      categories: [],
      currentCategory: null,
    };
  }

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = () => {
    $.ajax({
      url: `${BASE_URL}/questions?page=${this.state.page}`,
      type: 'GET',
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          categories: result.categories,
          currentCategory: result.current_category,
        });
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again');
        return;
      },
    });
  };

  selectPage = (num) => {
    this.setState({ page: num }, () => this.getQuestions());
  };

  getByCategory = (id) => {
    $.ajax({
      url: `${BASE_URL}/categories/${id}/questions`,
      type: 'GET',
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category,
        });
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again');
        return;
      },
    });
  };

  submitSearch = (searchTerm) => {
    $.ajax({
      url: `${BASE_URL}/questions/search`,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ search_term: searchTerm }),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category,
        });
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again');
        return;
      },
    });
  };

  questionAction = (id) => (action) => {
    if (action === 'DELETE') {
      if (window.confirm('are you sure you want to delete the question?')) {
        $.ajax({
          url: `${BASE_URL}/questions/${id}`,
          type: 'DELETE',
          success: (result) => {
            if (this.state.questions.length === 1) {
              this.setState(
                (prevState) => ({
                  page: prevState.page - 1,
                }),
                () => this.getQuestions()
              );
            } else {
              this.getQuestions();
            }
          },
          error: (error) => {
            alert('Unable to load questions. Please try your request again');
            return;
          },
        });
      }
    }
  };

  render() {
    return (
      <div className='question-view'>
        <Categories
          categories={this.state.categories}
          getQuestions={this.getQuestions}
          submitSearch={this.submitSearch}
          getByCategory={this.getByCategory}
        />
        <div className='questions-list'>
          <h2>Questions</h2>
          {this.state.questions.map((q, ind) => (
            <Question
              key={q.id}
              question={q.question}
              answer={q.answer}
              category={
                this.state.categories.find(
                  (category) => category.id === q.category
                ).type
              }
              difficulty={q.difficulty}
              questionAction={this.questionAction(q.id)}
            />
          ))}
          <Pagination
            totalQuestions={this.state.totalQuestions}
            page={this.state.page}
            selectPage={this.selectPage}
          />
        </div>
      </div>
    );
  }
}

export default QuestionView;
