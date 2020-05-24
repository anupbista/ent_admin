import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import API from '../../../../services/api';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';import history from '../../../../services/history';
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
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const { className, ...rest } = props;
  const { toggleLoading, toggleSetMobileOpen } = useContext(GlobalContext);
  const { toggleSnackbar, toggleSnackbarMsg } = useContext(SnackbarContext);

  const onLogout = async (props) => {
    let userid = localStorage.getItem('userid')
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
        toggleSnackbar(true);
        toggleSnackbarMsg('Logged out')
        history.push('/login');
      } else {
        localStorage.clear()
        toggleSnackbar(true);
        toggleSnackbarMsg('Unauthorized')
        history.push('/login');
      }
    } catch (error) {
      if (error.status === 401) {
        toggleSnackbarMsg('Unauthorized')
      }else{
        toggleSnackbarMsg(error.data ? error.data.message : 'Error occured');
      }
      toggleSnackbar(true);
      localStorage.clear()
      history.push('/login');
    }
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

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
          onClick={handleToggle}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
        >
          <AccountCircleIcon />
        </IconButton>
        <Popper className={classes.customWidth} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
