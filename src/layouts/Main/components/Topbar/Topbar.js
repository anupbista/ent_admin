import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import axios from 'axios';
import URL from 'env/env.dev';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();

  const onLogout = async () => {
    let userid = localStorage.getItem('userid')
    try {
      if(userid){
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : localStorage.getItem('access_token') ? 'Bearer '+ localStorage.getItem('access_token') : '' 
            }
          };
        await axios.get(URL.baseURL + 'auth/logout/'+userid, options);
        localStorage.clear()
        // history.push('/login');
      }else{
        localStorage.clear()
        // history.push('/login');
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <img
            alt="Logo"
            src="/images/logos/logo--white.svg"
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden smDown>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={onLogout}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden smUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
