/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, useContext, Fragment, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 10
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    background: theme.palette.primary.light,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  nested: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 10
  },
  rightIcon: {
    position: 'absolute',
    right: 5
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { close, pages, className, ...rest } = props;
  const { toggleSetMobileOpen } = useContext(GlobalContext);
  const classes = useStyles();
  const [opened, setOpened] = useState({});

  const handleClick = (e) => {
    setOpened({ ...opened, [e]: !opened[e] });
  };

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        <Fragment key={page.title}>
          <ListItem
            className={classes.item}
            disableGutters
          >
            {page.children.length > 0 ? <Button
              className={classes.button}
              onClick={ () => handleClick(page.title)}
            >
              <div className={classes.icon}>{page.icon}</div>
              {page.title}
              {opened[page.title] ? <ExpandLess className={classes.rightIcon} /> : <ExpandMore className={classes.rightIcon} />}
            </Button>
              : <Button
                onClick={close ? toggleSetMobileOpen : null}
                activeClassName={classes.active}
                className={classes.button}
                component={CustomRouterLink}
                to={page.href}
              >
                <div className={classes.icon}>{page.icon}</div>
                {page.title}
              </Button>}
          </ListItem>
          {page.children.length > 0 ?
            page.children.map( (child, index) => (
              <Collapse in={opened[page.title]} timeout="auto" unmountOnExit key={child.title}>
                <List component="div" disablePadding>
                  <ListItem
            disableGutters className={classes.nested}>
                    <Button
                      onClick={close ? toggleSetMobileOpen : null}
                      activeClassName={classes.active}
                      className={classes.button}
                      component={CustomRouterLink}
                      to={child.href}
                    >
                      <div className={classes.icon}>{child.icon}</div>
                      {child.title}
                    </Button>
                  </ListItem>
                </List>
              </Collapse>))
            : null}
        </Fragment>
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
