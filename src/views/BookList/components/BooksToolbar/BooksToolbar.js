import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { SearchInput } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 20
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    paddingLeft: 15
  }
}));

const UsersToolbar = props => {
  const { className, onOpen, ...rest } = props;
  const [searchInput, setSearchInput] = useState(null);
  const classes = useStyles();

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

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
      <form onSubmit={handleSubmit}>

      <Paper className={classes.root}>
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
        <span className={classes.spacer} />
        <Button
          color="primary"
          onClick={handleNewPressed}
          variant="contained"
        >
          Add book
        </Button>
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string
};

export default UsersToolbar;
