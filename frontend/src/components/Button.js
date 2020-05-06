import React from 'react';

const Button = (props) => {
  const { text, ...buttonProps } = props;
  return <button {...buttonProps}>{text}</button>;
};

export default Button;
