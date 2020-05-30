import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Count from './components/Count';
import LatestMovies from './components/LatestMovies';
import LatestBooks from './components/LatestBooks';
import PeopleIcon from '@material-ui/icons/People';
import TheatersIcon from '@material-ui/icons/Theaters';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import YouTubeIcon from '@material-ui/icons/YouTube';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import API from '../../services/api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
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
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleSnackbar, toggleSnackbarMsg } = useContext(SnackbarContext);
  const [ dashboardData, setDashboardData ] = useState({
    videosData: {},
    moviesData: {},
    booksData: {},
    gamesData: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        toggleLoading(true)
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
          }
        };
        const data = await Promise.all([
          API.get('/movies/dashboard', options),
          API.get('/books/dashboard', options),
          API.get('/games/dashboard', options),
          API.get('/youtubevideos/dashboard', options),
        ]);
        setDashboardData({
          moviesData: data[0].data,
          booksData: data[1].data,
          gamesData: data[2].data,
          videosData: data[3].data,
        })
        toggleLoading(false)
      } catch (error) {
        console.log(error)
        toggleLoading(false);
        if (error.status === 401) {
          toggleSnackbarMsg('Unauthorized')
        }
        else {
          toggleSnackbarMsg(error.data ? error.data.message : 'Error occured');
        }
        toggleSnackbar(true);
      }
    }
    fetchData();
  }, [])

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
      >

        <Grid item lg={3} xs={6}>
          <Count count={dashboardData.moviesData.count} name={'MOVIES'} icon={<TheatersIcon />} />
        </Grid>

        <Grid item lg={3} xs={6}>
          <Count count={dashboardData.booksData.count} name={'BOOKS'} icon={<MenuBookIcon />} />
        </Grid>

        <Grid item lg={3} xs={6}>
          <Count count={dashboardData.gamesData.count} name={'GAMES'} icon={<SportsEsportsIcon />} />
        </Grid>

        <Grid item lg={3} xs={6}>
          <Count count={dashboardData.videosData.count} name={'VIDEOS'} icon={<YouTubeIcon />} />
        </Grid>

        <Grid
          item
          lg={6}
          md={6}
          xl={12}
          xs={12}
        >
        <LatestMovies movies={dashboardData.moviesData.movies ? dashboardData.moviesData.movies : []} />
        </Grid>

        <Grid
          item
          lg={6}
          md={6}
          xl={12}
          xs={12}
        >
        <LatestBooks books={dashboardData.booksData.books ? dashboardData.booksData.books : []} />
        </Grid>

        {/* <Grid
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
        </Grid> */}
      </Grid>
    </div>
  );
};

export default Dashboard;
