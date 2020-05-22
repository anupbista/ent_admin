import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersTable } from './components';
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

const UserList = () => {
  const classes = useStyles();
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleError } = useContext(ErrorContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name', sort: false },
    { id: 'username', numeric: false, disablePadding: false, label: 'Username', sort: true },
    { id: 'role', numeric: false, disablePadding: false, label: 'Role', sort: true },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email', sort: true },
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
    let res = await API.get('/' + 'users', options);
    toggleLoading(false);
    toggleError(false);
    setUsers(res.data)
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

  const handleSnackbarClose = () => {
    setError(null)
  }

  useEffect( ()=> {
    fetchData();
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.content}>
      <Snackbar open={error ? true : false} autoHideDuration={3000} message={error ? error : 'Error Occured'} onClose={handleSnackbarClose}></Snackbar>
        <UsersTable onClose={closeFormDialog} headCells={headCells} users={users} />
      </div>
    </div>
  );
};

export default UserList;
