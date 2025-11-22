import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

export const useTaskRefresh = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskRefresh must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const value = {
    refreshTrigger,
    triggerRefresh,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
