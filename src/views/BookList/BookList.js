import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { BooksTable } from './components';
import axios from 'axios';
import URL from 'env/env.dev';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const BookList = () => {
  const classes = useStyles();

  const [books, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name', sort: true },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description', sort: true },
    { id: 'releasedate', numeric: false, disablePadding: false, label: 'Releasedate', sort: true },
    { id: 'author', numeric: false, disablePadding: false, label: 'Author', sort: true },
    { id: 'publisher', numeric: false, disablePadding: false, label: 'Publisher', sort: true },
    { id: 'Actions', numeric: false, disablePadding: false, label: 'Actions', sort: false },
  ];


  const fetchData = async () => {
    try {
      setLoading(true);
      const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : localStorage.getItem('access_token') ? 'Bearer '+ localStorage.getItem('access_token'): '' 
        }
      };
      let res = await axios.get(URL.baseURL + 'books', options);
      setMovies(res.data)
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error)
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
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop> 
        <BooksTable onClose={closeFormDialog} headCells={headCells} books={books} />
      </div>
    </div>
  );
};

export default BookList;
