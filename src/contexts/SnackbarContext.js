import React, { createContext, useState } from 'react';

export const SnackbarContext = createContext();

const SnackbarContextProvider = (props) => {
  
const [globalSnackbar, setGlobalSnackbar] = useState(false);
  const [globalSnackbarMsg, setGlobalSnackbarMsg] = useState('Unauthorized');

  const toggleSnackbar = (state) => {
    setGlobalSnackbar(state)
  }

  const toggleSnackbarMsg = (msg) => {
    setGlobalSnackbarMsg(msg)
  }

  return (
    <SnackbarContext.Provider value={{globalSnackbar, toggleSnackbar: toggleSnackbar, globalSnackbarMsg, toggleSnackbarMsg: toggleSnackbarMsg}}>
      {props.children}
    </SnackbarContext.Provider>
  );
}
 
export default SnackbarContextProvider;