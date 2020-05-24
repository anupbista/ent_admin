import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { MoviesTable } from './components';
import API from '../../services/api';
import { GlobalContext } from '../../contexts/GlobalContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10000,
    color: '#fff',
  },
}));

const MovieList = () => {
  const classes = useStyles();

  const [movies, setMovies] = useState([]);
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleSnackbar } = useContext(SnackbarContext);
   const { toggleSnackbarMsg } = useContext(SnackbarContext);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name', sort: true },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description', sort: true },
    { id: 'releasedate', numeric: false, disablePadding: false, label: 'Releasedate', sort: true },
    { id: 'rating', numeric: false, disablePadding: false, label: 'Rating', sort: true },
    { id: 'Actions', numeric: false, disablePadding: false, label: 'Actions', sort: false },
  ];


  const fetchData = async () => {
    try {
      toggleLoading(true);
      const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : localStorage.getItem('access_token') ? 'Bearer '+ localStorage.getItem('access_token'): '' 
        }
      };
      let res = await API.get('/movies', options);
      setMovies(res.data)
      toggleLoading(false);
    } catch (error) {
      toggleLoading(false);
      if(error.status === 401){
        toggleSnackbarMsg('Unauthorized')
      }else{
        toggleSnackbarMsg(error.data ? error.data.message : 'Error occured');
      }
      toggleSnackbar(true);
     }
    }

  const closeFormDialog = (loadData) => {
    if(loadData) fetchData()
  }

  useEffect( ()=> {
    fetchData();
  }, [])


  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <MoviesTable onClose={closeFormDialog} headCells={headCells} movies={movies} />
      </div>
    </div>
  );
}

export default MovieList;
