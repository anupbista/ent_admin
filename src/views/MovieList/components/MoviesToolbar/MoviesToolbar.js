import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';
import API from '../../../../services/api';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(3)
    }
  },
  row: {
    height: '42px',
    display: 'flex',
    marginBottom: 20,
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchBox: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    '& form': {
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(3)
      }
    }
  },
  searchInput: {
    paddingLeft: 15,
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    marginLeft: 20,
    '&:first-child': {
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0
      }
    }
  },
  actionButtons: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
      marginBottom: 20
    }
  }
}));

const UsersToolbar = props => {
  const { className, onOpen, ...rest } = props;
  const [searchInput, setSearchInput] = useState(null);
  const classes = useStyles();
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleSnackbar } = useContext(SnackbarContext);
  const { toggleSnackbarMsg } = useContext(SnackbarContext);

  const handleNewPressed = () => {
    props.onClose(null);
  }

  const onChangeHandler = (e) => {
    setSearchInput(e.target.value)
  }

  const onSearch = () => {
    onOpen(searchInput)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleExport = async () => {
    try {
      toggleLoading(true);
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
        },
        'responseType': "blob",
      };
      let res = await API.get('/movies/report?limit=0', options);
      const url = window.URL.createObjectURL(new Blob([res.data], {
        type: "application/vnd.ms-excel"
      }));
      const link = document.createElement('a');
      link.href = url;
      let filename = res.headers['content-disposition'].split('/')[1];
      link.setAttribute('download', filename); //or any other extension
      document.body.appendChild(link);
      link.click();
      toggleLoading(false);
      toggleSnackbarMsg('Successfully exported')
      toggleSnackbar(true);
    } catch (error) {
      toggleLoading(false);
      if (error.status === 401) {
        toggleSnackbarMsg('Unauthorized')
      } else {
        toggleSnackbarMsg(error.data ? error.data.message : 'Error occured');
      }
      toggleSnackbar(true);
    }
  }

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <Grid justify="space-between" container>
          <Box xs={12} className={classes.searchBox}>
            <form onSubmit={handleSubmit}>

              <Paper className={classes.searchContainer}>
                <InputBase
                  className={classes.searchInput}
                  onChange={onChangeHandler}
                  placeholder="Search Movie"
                  inputProps={{ 'aria-label': 'search movie' }}
                />
                <IconButton onClick={onSearch} className={classes.iconButton} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
            </form>
          </Box>
          <Box xs={12} className={classes.actionButtons}>
            <Button
              color="primary"
              onClick={handleNewPressed}
              variant="contained"
              className={classes.button}
              startIcon={<AddCircleIcon />}>
              Add movie
            </Button>
            <Button
              color="primary"
              onClick={handleExport}
              variant="contained"
              className={classes.button}
              startIcon={<CloudDownloadIcon />}>
              Export
            </Button>
          </Box>
        </Grid>
      </div>
    </div >
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string
};

export default UsersToolbar;
