import React, { useState } from 'react';
import Button from './Button';

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
      <Button type='submit' className='button' text="Search" />
    </form>
  );
};

export default Search;
