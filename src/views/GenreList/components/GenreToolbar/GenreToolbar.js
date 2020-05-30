import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
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

const GenreToolbar = props => {
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
        placeholder="Search Genre"
        inputProps={{ 'aria-label': 'search genre' }}
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
          Add genre
        </Button>
      </div>
    </div>
  );
};

GenreToolbar.propTypes = {
  className: PropTypes.string
};

export default GenreToolbar;
