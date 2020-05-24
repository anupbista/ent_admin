import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import API from '../../../../services/api';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import history from '../../../../services/history';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  logo: {
    width: '40%'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  customWidth: {
    '& div': {
      width: '150px',
    }
  }
}));

const Topbar = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { className, ...rest } = props;
  const { toggleLoading, toggleSetMobileOpen } = useContext(GlobalContext);
  const { toggleSnackbar } = useContext(SnackbarContext);

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
        toggleSnackbar(true);
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
      position="fixed" className={classes.appBar}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSetMobileOpen}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <RouterLink to="/">
          <img className={classes.logo}
            alt="Logo"
            src="/images/logos/logo-white.png"
          />
        </RouterLink>
        <div className={classes.flexGrow} />
        <IconButton
          color="inherit"
          onClick={handleClick}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu className={classes.customWidth}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
