import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

const GlobalContextProvider = (props) => {
  
  const [loading, setLoading] = useState(false);
  const [ loggedinuser, setUser ] = useState({});

  const toggleLoading = (loadingState) => {
    setLoading(loadingState)
  }

  const setLoggedInUser = (user) => {
    setUser(user)
  }

  return (
    <GlobalContext.Provider value={{loading, toggleLoading: toggleLoading, loggedinuser, setLoggedInUser: setLoggedInUser}}>
      {props.children}
    </GlobalContext.Provider>
  );
}
 
export default GlobalContextProvider;