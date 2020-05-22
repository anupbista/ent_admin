import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery, Snackbar } from '@material-ui/core';
import API from '../../services/api';

import { Sidebar, Topbar } from './components';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ErrorContext } from '../../contexts/ErrorContext';

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
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10000,
    color: '#fff',
  }
}));

const Main = props => {
  const classes = useStyles();
  const { children } = props;
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });
  const [openSidebar, setOpenSidebar] = useState(false);
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { globalError, toggleError } = useContext(ErrorContext);
  const { loggedinuser, setLoggedInUser } = useContext(GlobalContext)

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userid = localStorage.getItem('userid');
        toggleLoading(true)
        if (userid) {
          const options = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
            }
          };
          let res = await API.get('/users/' + userid, options);
          // let imagepath = res.data.imagepath ? res.data.imagepath.split('/') : null
          // if (imagepath) {
          //   imagepath.shift();
          //   imagepath = imagepath.join('/')
          //   res.data.imagepath = res.data.imagepath ? URL.appURL + imagepath : null
          // }
          setLoggedInUser(res.data)
        }
        toggleLoading(false)
      } catch (error) {
        toggleLoading(false)
      }
    }
    fetchData();
  }, [])

  const handleGlobalSnackbarClose = () => {
    toggleError(false)
  }

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Snackbar open={globalError} autoHideDuration={3000} message={'Unauthorized'} onClose={handleGlobalSnackbarClose}></Snackbar>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Topbar onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        user={loggedinuser}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
      </main>
    </div>
  )
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
