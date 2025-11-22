import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-dark-200 dark:bg-dark-700 rounded';
  
  const variants = {
    text: 'h-4 w-3/4',
    circle: 'h-10 w-10 rounded-full',
    rect: 'h-32 w-full',
    card: 'h-64 w-full rounded-lg',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;
