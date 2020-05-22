import React, { createContext, useState } from 'react';

export const ErrorContext = createContext();

const ErrorContextProvider = (props) => {
  
  const [globalError, setGlobalError] = useState(false);

  const toggleError = (errorState) => {
    console.log("GLobal eror", errorState)
    setGlobalError(errorState)
  }

  return (
    <ErrorContext.Provider value={{globalError, toggleError: toggleError}}>
      {props.children}
    </ErrorContext.Provider>
  );
}
 
export default ErrorContextProvider;