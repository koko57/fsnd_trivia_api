import React from 'react';

const ChooseCategory = (props) => {
  const { categories, selectCategory } = props;
  return (
    <div className='quiz-play-holder'>
      <div className='choose-header'>Choose Category</div>
      <div className='category-holder'>
        <div className='play-category' onClick={selectCategory}>
          ALL
        </div>
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              value={category.id}
              className='play-category'
              onClick={() => selectCategory(category)}
            >
              {category.type}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseCategory;
