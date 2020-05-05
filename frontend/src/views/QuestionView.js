import React, { useState, useEffect } from 'react';
import Question from '../components/Question';
import Pagination from '../components/Pagination';
import axios from 'axios';
import { config } from '../config';

import '../stylesheets/App.css';
import Categories from '../components/Categories';
import Modal from '../components/Modal';

const { BASE_URL } = config;

const QuestionView = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    getQuestions();
  }, [page]);

  const getQuestions = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/questions?page=${page}`);
      setQuestions(data.questions);
      setTotalQuestions(data.total_questions);
      setCategories(data.categories);
      setCurrentCategory(data.current_category);
    } catch (error) {
      setError(error);
    }
  };

  const selectPage = (num) => {
    setPage(num);
  };

  const getByCategory = async (id) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/categories/${id}/questions`
      );
      setQuestions(data.questions);
      setTotalQuestions(data.total_questions);
      setCurrentCategory(data.current_category);
    } catch (error) {
      setError(error);
    }
  };

  const submitSearch = async (searchTerm) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/questions/search`, {
        search_term: searchTerm,
      });
      setQuestions(data.questions);
      setTotalQuestions(data.total_questions);
      setCurrentCategory(data.current_category);
    } catch (err) {
      setError(err.message);
    }
  };

  const questionAction = (id) => {
    setDeleteId(id);
    setModalOpened(true);
  };

  const onAccept = async () => {
    await axios.delete(`${BASE_URL}/questions/${deleteId}`);
    setDeleteId('');
    if (questions.length === 1) {
      setPage(page - 1);
    } else {
      getQuestions();
    }
  };

  const onClose = () => {
    setError('');
    setModalOpened(false);
  };

  const modalProps = error
    ? {
        message: error,
        onClose,
      }
    : {
        message: 'Are you sure you want to delete this question?',
        onAccept,
        onClose,
      };

  return (
    <div className='question-view'>
      {modalOpened && <Modal {...modalProps} />}
      <Categories
        categories={categories}
        currentCategory={currentCategory}
        getQuestions={getQuestions}
        submitSearch={submitSearch}
        getByCategory={getByCategory}
      />
      <div className='questions-list'>
        <h2>Questions</h2>
        {questions.map((q) => (
          <Question
            key={q.id}
            {...q}
            category={
              categories.find((category) => category.id === q.category)?.type
            }
            questionAction={questionAction}
          />
        ))}
        <Pagination
          totalQuestions={totalQuestions}
          page={page}
          selectPage={selectPage}
        />
      </div>
    </div>
  );
};

export default QuestionView;
