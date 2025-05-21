import React from 'react';
import './style.css'; // Importa o CSS

function Button({ content, icon, ...props }) {
  return (
    <button className="StyledButton" {...props}>
      {icon}
      {content}
    </button>
  );
}

export default Button;
