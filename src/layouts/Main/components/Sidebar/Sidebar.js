import React, { useContext, Children } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer, Hidden } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { Profile, SidebarNav, Footer } from './components';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import TheatersIcon from '@material-ui/icons/Theaters';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import CategoryIcon from '@material-ui/icons/Category';
import VideocamIcon from '@material-ui/icons/Videocam';
import PersonIcon from '@material-ui/icons/Person';
import ClassIcon from '@material-ui/icons/Class';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { GlobalContext } from '../../../../contexts/GlobalContext';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
    justifyContent: 'space-between'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { onClose, className, user, ...rest } = props;
  const { window } = props;
  const { mobileOpen, toggleSetMobileOpen } = useContext(GlobalContext);
  const classes = useStyles();
  const container = window !== undefined ? () => window().document.body : undefined;

  const pages = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,
      children: []
    },
    {
      title: 'Users',
      href: '/users',
      icon: <PeopleIcon />,
      children: []
    },
    {
      title: 'Movies',
      href: '/movies',
      icon: <TheatersIcon />,
      children: [
        {
          title: 'Movies',
          href: '/movies',
          icon: <TheatersIcon />,
          children: []
        },
        {
          title: 'Genre',
          href: '/genre',
          icon: <ClassIcon />,
          children: []
        },
      ]
    },
    {
      title: 'Books',
      href: '/books',
      icon: <MenuBookIcon />,
      children: []
    },
    {
      title: 'Games',
      href: '/games',
      icon: <SportsEsportsIcon />,
      children: [
        {
          title: 'Games',
          href: '/games',
          icon: <SportsEsportsIcon />,
          children: []
        },
        {
          title: 'Category',
          href: '/category',
          icon: <CategoryIcon />
        }
      ]
    },
    {
      title: 'Youtube',
      href: '/youtubevideos',
      icon: <YouTubeIcon />,
      children: [
        {
          title: 'Videos',
          href: '/youtubevideos',
          icon: <VideocamIcon />,
          children: []
        },
        {
          title: 'Category',
          href: '/youtubecategory',
          icon: <CategoryIcon />
        },
        {
          title: 'Channels',
          href: '/youtubechannels',
          icon: <PersonIcon />
        }
      ]
    },
    {
      title: 'Account',
      href: '/account',
      icon: <AccountBoxIcon />,
      children: []
    }
  ];

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden smUp implementation="css">
        <Drawer
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          onClose={toggleSetMobileOpen}
          open={mobileOpen}
          variant={'temporary'}
          container={container}
        >
          <div
            {...rest}
            className={clsx(classes.root, className)}
          >
            <div>
            <Profile user={user} />
            <Divider className={classes.divider} />
            <SidebarNav
              close={true}
              className={classes.nav}
              pages={pages}
            />
             <Divider className={classes.divider} />
            </div>
            <Footer />
          </div>
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{ paper: classes.drawerPaper }}
          open
          variant={'permanent'}
        >
          <div
            {...rest}
            className={clsx(classes.root, className)}
          >
           <div>
           <Profile user={user} />
            <Divider className={classes.divider} />
            <SidebarNav
              close={false}
              className={classes.nav}
              pages={pages}
            />
            <Divider className={classes.divider} />
           </div>
            <Footer />
          </div>
        </Drawer>
      </Hidden>
    </nav>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string
};

export default Sidebar;
