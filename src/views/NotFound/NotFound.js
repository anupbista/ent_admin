import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 100,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  image: {
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  },
  text: {
    marginTop: 50
  },
  button:{
    marginTop: 50
  }
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >
          <div className={classes.content}>
            <img
              alt="Under development"
              className={classes.image}
              src="/images/not_found.svg"
            />
             <Typography variant="h1" className={classes.text}>
              404: The page you are looking for isn’t here
            </Typography>
            <Button className={classes.button} component={Link} to="/dashboard" variant="contained" color="primary">
              Go to dashboard
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFound;
