import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
} from '@material-ui/core';
import API from '../../services/api';
import history from '../../services/history';
import { GlobalContext } from '../../contexts/GlobalContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';

const schema = {
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  logoImge:{
    width: '60%',
    marginBottom: 50
  },
  content: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 50,
    paddingTop: 50,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(4)
  },
  signInButton: {
    margin: theme.spacing(4, 0)
  },
}));

const SignIn = props => {

  const classes = useStyles();
  const { toggleLoading } = useContext(GlobalContext)
  const [ submitted, setSubmitted ] = useState(false)
  const { toggleSnackbar, toggleSnackbarMsg } = useContext(SnackbarContext);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
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
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    const options = {
      headers: {
          'Content-Type': 'application/json',
      }
    };
    const data = {
      username: formState.values.username,
      password: formState.values.password
    }
    try {
      setSubmitted(true)
      toggleLoading(true)
      let res = await API.post('/auth/login', data, options);
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('userid', res.data.userid);
      toggleLoading(false)
      toggleSnackbar(true);
      toggleSnackbarMsg('Logged in')
      history.push('/');
    } catch (error) {
      setSubmitted(false)
      toggleSnackbar(true)
      toggleSnackbarMsg('Username/Password is incorrect')
      toggleLoading(false)
    }
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.content}
          item
          lg={12}
          xs={12}
        >
          <Paper>
            <div className={classes.content}>
              <div className={classes.contentBody}>
                <form
                  className={classes.form}
                  onSubmit={handleSignIn}
                >
                <Box justifyContent="center" display="flex">
                 <img className={classes.logoImge}
                    alt="Logo"
                    src="/images/logos/logo-blue.png"
                  />
                 </Box>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    Log in
                </Typography>
                  <TextField
                    className={classes.textField}
                    error={hasError('username')}
                    fullWidth
                    helperText={
                      hasError('username') ? formState.errors.username[0] : null
                    }
                    label="Username"
                    name="username"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.username || ''}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('password')}
                    fullWidth
                    helperText={
                      hasError('password') ? formState.errors.password[0] : null
                    }
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.password || ''}
                    variant="outlined"
                  />
                  <Button
                    className={classes.signInButton}
                    color="primary"
                    disabled={!formState.isValid}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Log in
                </Button>
                </form>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
