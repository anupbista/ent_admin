import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

const GlobalContextProvider = (props) => {
  
  const [loading, setLoading] = useState(false);
  const [ loggedinuser, setUser ] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLoading = (loadingState) => {
    setLoading(loadingState)
  }

  const setLoggedInUser = (user) => {
    setUser(user)
  }

  const toggleSetMobileOpen = () => {
    setMobileOpen(!mobileOpen);
  }

  return (
    <GlobalContext.Provider value={{loading, toggleLoading: toggleLoading, loggedinuser, setLoggedInUser: setLoggedInUser, mobileOpen, toggleSetMobileOpen: toggleSetMobileOpen}}>
      {props.children}
    </GlobalContext.Provider>
  );
}
 
export default GlobalContextProvider;