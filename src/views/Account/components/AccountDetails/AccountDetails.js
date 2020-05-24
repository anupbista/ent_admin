import React, { useState, useContext, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';
import validate from 'validate.js';
import API from '../../../../services/api';

const schema = {
  firstname: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  lastname: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true
  },
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const { loggedinuser, toggleLoading, setLoggedInUser } = useContext(GlobalContext)
  const { toggleSnackbar, toggleSnackbarMsg } = useContext(SnackbarContext);
  const [submitted, setSubmitted] = useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      firstname: '',
      middlename: '',
      lastname: '',
      email: '',
      username: ''
    },
    touched: {},
    errors: {}
  });

  useEffect(() => {
    let user = {}
    if(!loggedinuser){
      user = {
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        username: ''
      }
    }else{
      user = {
        firstname: loggedinuser.firstname || '',
        middlename: loggedinuser.middlename || '',
        lastname: loggedinuser.lastname || '',
        email: loggedinuser.email || '',
        username: loggedinuser.username || ''
      }
    }
    setFormState(formState => ({
      ...formState,
      values: user
    }));
  }, [loggedinuser])

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

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
      }
    };
    const data = {
      firstname: formState.values.firstname,
      middlename: formState.values.middlename,
      lastname: formState.values.lastname,
      email: formState.values.email,
      username: formState.values.username,
    }
    try {
      toggleLoading(true);
      await API.patch('/users/' + loggedinuser.id, data, options);
      setSubmitted(true)
      toggleLoading(false);
      toggleSnackbarMsg('User updated');
      loggedinuser.firstname = data.firstname;
      loggedinuser.middlename = data.middlename;
      loggedinuser.lastname = data.lastname;
      loggedinuser.email = data.email;
      loggedinuser.username = data.username;
      setLoggedInUser(loggedinuser);
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
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleUpdateUser}>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                label="First name"
                name="firstname"
                onChange={handleChange}
                required
                value={formState.values.firstname}
                variant="outlined"
                error={hasError('firstname')}
                helperText={
                  hasError('firstname') ? formState.errors.firstname[0] : null
                }
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                label="Middle name"
                name="middlename"
                onChange={handleChange}
                value={formState.values.middlename || ''}
                variant="outlined"
                error={hasError('middlename')}
                helperText={
                  hasError('middlename') ? formState.errors.middlename[0] : null
                }
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                label="Last name"
                name="lastname"
                onChange={handleChange}
                required
                value={formState.values.lastname}
                variant="outlined"
                error={hasError('lastname')}
                helperText={
                  hasError('lastname') ? formState.errors.lastname[0] : null
                }
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                onChange={handleChange}
                required
                value={formState.values.email}
                variant="outlined"
                error={hasError('email')}
                helperText={
                  hasError('email') ? formState.errors.email[0] : null
                }
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Username"
                name="username"
                onChange={handleChange}
                type="text"
                value={formState.values.username}
                variant="outlined"
                error={hasError('username')}
                helperText={
                  hasError('username') ? formState.errors.username[0] : null
                }
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
          disabled={!formState.isValid}
          onClick={handleUpdateUser}
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
