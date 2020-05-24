import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { GenreTable } from './components';
import API from '../../services/api';
import { GlobalContext } from '../../contexts/GlobalContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';

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
  const { toggleSnackbar } = useContext(SnackbarContext);
   const { toggleSnackbarMsg } = useContext(SnackbarContext);

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
        <GenreTable onClose={closeFormDialog} headCells={headCells} genres={genres} />
      </div>
    </div>
  );
};

export default GenreList;
