import React from 'react';
import '../stylesheets/Button.scss'

const Button = (props) => {
  const { text, ...buttonProps } = props;
  return <button {...buttonProps} className="button">{text}</button>;
};

export default Button;
