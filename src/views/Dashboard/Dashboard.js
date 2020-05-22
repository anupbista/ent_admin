import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
  image: {
    display: 'inline-block',
    maxWidth: '100%',
    width: 560,
    marginBottom: 50,
  }
}));


const Dashboard = () => {
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
              alt="Welcome"
              className={classes.image}
              src="/images/welcome.png"
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
