import React, { useState } from 'react';

const Search = (props) => {
  const [query, setQuery] = useState('');

  const getInfo = (e) => {
    e.preventDefault();
    props.submitSearch(query);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={getInfo}>
      <input
        type='text'
        placeholder='Search questions...'
        value={query}
        onChange={handleInputChange}
      />
      <input type='submit' value='Submit' className='button' />
    </form>
  );
};

export default Search;
