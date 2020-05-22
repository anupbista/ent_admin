import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { GenreTable } from './components';
import API from '../../services/api';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import { Snackbar } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const GenreList = () => {
  const classes = useStyles();

  const [genres, setMovies] = useState([]);
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleError } = useContext(ErrorContext);
  const [error, setError] = useState(false);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name', sort: true },
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
      let res = await API.get('/genre', options);
      setMovies(res.data)
      toggleLoading(false);
      setError(false);
    } catch (error) {
      toggleLoading(false);
      if(error.status === 401){
        toggleError(true);
      }
      setError(error.data ? error.data.message : 'Error occured');
     }
  }

  const closeFormDialog = (loadData) => {
    if(loadData) fetchData()
  }

  useEffect( ()=> {
    fetchData();
  }, [])

  const handleSnackbarClose = () => {
    setError(null)
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
      <Snackbar open={error ? true : false} autoHideDuration={3000} message={error ? error : 'Error Occured'} onClose={handleSnackbarClose}></Snackbar>
        <GenreTable onClose={closeFormDialog} headCells={headCells} genres={genres} />
      </div>
    </div>
  );
};

export default GenreList;
