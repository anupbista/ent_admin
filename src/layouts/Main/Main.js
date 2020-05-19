import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';
import axios from 'axios';

import { Sidebar, Topbar } from './components';
import URL from 'env/env.dev';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: '100%',
    background: '#fff'
  }
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);
  const [user, setUser] = useState({});

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  useEffect( ()=> {
    let userid = localStorage.getItem('userid');
    try {
      async function fetchData(){
        if(userid){
          const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : localStorage.getItem('access_token') ? 'Bearer '+ localStorage.getItem('access_token'): '' 
            }
          };
          let res = await axios.get(URL.baseURL + 'users/'+userid, options);
          let imagepath = res.data.imagepath ? res.data.imagepath.split('/') : null
          if(imagepath){
            imagepath.shift();
            imagepath = imagepath.join('/')
            res.data.imagepath = res.data.imagepath ? URL.appURL + imagepath : null
          }
          setUser(res.data)
        }
      }
      fetchData();
    } catch (error) {
      console.log(error)
    }
  }, [])


  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        user={user}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
      </main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
