import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import API from '../../../../services/api';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import history from '../../../../services/history';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { ErrorContext } from '../../../../contexts/ErrorContext';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  }
}));

const Topbar = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { className, onSidebarOpen, ...rest } = props;
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleError } = useContext(ErrorContext);

  const onLogout = async (props) => {
    let userid = localStorage.getItem('userid')
    handleClose();
    try {
      if (userid) {
        toggleLoading(true)
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
          }
        };
        await API.get('/auth/logout/' + userid, options);
        toggleLoading(false)
        localStorage.clear()
        history.push('/login');
      } else {
        localStorage.clear()
        history.push('/login');
      }
    } catch (error) {
      if (error.status === 401) {
        toggleError(true);
      }
      localStorage.clear()
      history.push('/login');
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <IconButton
          color="inherit"
          onClick={handleClick}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
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
