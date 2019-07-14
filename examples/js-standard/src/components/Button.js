import React from 'react';
import styles from '../styles/button.module.css';

export default function Button({ children, onClick, ...props }) {
  // Add keydown support if we "forget" to do this in the parent component
  const handleKeyDown = e => {
    if ((e.key === 'Enter' || e.key === ' ') && !props.onKeyDown) {
      onClick();
    }
  };

  return (
    <div
      className={styles.button}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}
