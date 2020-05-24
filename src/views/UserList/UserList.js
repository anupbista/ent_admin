import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersTable } from './components';
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

const UserList = () => {
  const classes = useStyles();
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleSnackbar } = useContext(SnackbarContext);
  const [users, setUsers] = useState([]);
   const { toggleSnackbarMsg } = useContext(SnackbarContext);

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
    let res = await API.get('/users', options);
    toggleLoading(false);
    setUsers(res.data)
   } catch (error) {
    toggleLoading(false);
    if(error.status === 401){
      toggleSnackbarMsg('Unauthorized')
    }
    else{
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
        <UsersTable onClose={closeFormDialog} headCells={headCells} users={users} />
      </div>
    </div>
  );
};

export default UserList;
