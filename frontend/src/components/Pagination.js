import React from 'react';

const Pagination = (props) => {
  const { totalQuestions, page, selectPage } = props;
  const pageNumbers = new Array(Math.ceil(totalQuestions / 10)).fill(1);

  return (
    <div className='pagination-menu'>
      {pageNumbers.map((p, i) => {
        const pageNumber = p + i;
        return (
          <span
            key={pageNumber}
            className={`page-num ${pageNumber === page ? 'active' : ''}`}
            onClick={() => selectPage(pageNumber)}
          >
            {pageNumber}
          </span>
        );
      })}
    </div>
  );
};

export default Pagination;
