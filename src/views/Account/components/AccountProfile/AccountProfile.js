import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Avatar,
  Chip
} from '@material-ui/core';
import { GlobalContext } from '../../../../contexts/GlobalContext';

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
    marginBottom: 20
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const { loggedinuser } = useContext(GlobalContext)

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <Avatar
            className={classes.avatar}
            src={loggedinuser.imagepath}
          />
          <Chip label={loggedinuser.role} />
        </div>
      </CardContent>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
