import React from 'react';
import Search from './Search';

const Categories = (props) => {
  const { categories, getQuestions, submitSearch, getByCategory } = props;

  return (
    <div className='categories-list'>
      <h2
        onClick={() => {
          getQuestions();
        }}
      >
        Categories
      </h2>
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            onClick={() => {
              getByCategory(category.id);
            }}
          >
            {category.type}
            <img className='category' src={`assets/${category.type}.svg`} />
          </li>
        ))}
        <li onClick={getQuestions}>All</li>
      </ul>
      <Search submitSearch={submitSearch} />
    </div>
  );
};

export default Categories;
