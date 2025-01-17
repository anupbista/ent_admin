import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GlobalContext } from '../../contexts/GlobalContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { Snackbar } from '@material-ui/core';

import { Topbar } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 64,
    height: '100%'
  },
  content: {
    height: '100%'
  },
  backdrop: {
   zIndex: theme.zIndex.drawer + 10000,
   color: '#fff',
 }
}));

const Minimal = props => {
  const { children } = props;

  const classes = useStyles();
  const { loading } = useContext(GlobalContext)
  const { globalSnackbar, toggleSnackbar } = useContext(SnackbarContext);
  const { globalSnackbarMsg } = useContext(SnackbarContext);

  const handleGlobalSnackbarClose = () => {
    toggleSnackbar(false)
  }
  
  return (
    <div className={classes.root}>
      <Snackbar open={globalSnackbar} autoHideDuration={3000} message={globalSnackbarMsg ? globalSnackbarMsg : 'Unauthorized'} onClose={handleGlobalSnackbarClose}></Snackbar>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Topbar />
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Minimal;
