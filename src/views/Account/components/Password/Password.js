import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField
} from '@material-ui/core';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';
import API from '../../../../services/api';
import validate from 'validate.js';

const schema = {
  oldpassword: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  newpassword: {
    presence: { allowEmpty: false, message: 'is required' }
  }
};

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 40
  }
}));

const Password = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const { loggedinuser, toggleLoading } = useContext(GlobalContext)
  const { toggleSnackbar, toggleSnackbarMsg } = useContext(SnackbarContext);
  const [submitted, setSubmitted] = useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      oldpassword: '',
      newpassword: ''
    },
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
      }
    };
    const data = {
      oldpassword: formState.values.oldpassword,
      newpassword: formState.values.newpassword,
    }
    try {
      toggleLoading(true);
      await API.post('/auth/passwordchange/' + loggedinuser.id, data, options);
      setSubmitted(true)
      toggleLoading(false);
      toggleSnackbarMsg('Password updated')
      toggleSnackbar(true);
    } catch (error) {
      setSubmitted(false);
      toggleLoading(false)
      if (error.status === 401) {
        toggleSnackbarMsg('Unauthorized');
      } else {
        toggleSnackbarMsg(error.data ? error.data.message : 'Error occured');
      }
      toggleSnackbar(true);
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleUpdatePassword}>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Old password"
            name="oldpassword"
            onChange={handleChange}
            error={hasError('oldpassword')}
            type="password"
            helperText={
              hasError('oldpassword') ? formState.errors.oldpassword[0] : null
            }
            value={formState.values.oldpassword}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="New password"
            name="newpassword"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            helperText={
              hasError('newpassword') ? formState.errors.newpassword[0] : null
            }
            error={hasError('newpassword')}
            value={formState.values.newpassword}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            disabled={!formState.isValid}
            onClick={handleUpdatePassword}
            color="primary"
            variant="outlined"
          >
            Update
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
