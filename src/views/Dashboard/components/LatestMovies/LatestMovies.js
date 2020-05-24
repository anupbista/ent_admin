import React from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner:{
    minHeight: 400
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));


const LatestMovies = props => {
  const { className, movies, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Latest Movies Added"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Release date</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movies.map(movie => (
                  <TableRow
                    hover
                    key={movie.id}
                  >
                    <TableCell>{movie.name}</TableCell>
                    <TableCell>{movie.releasedate}</TableCell>
                    <TableCell>{movie.rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
          component={Link} to="/movies"
      >
          View all <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LatestMovies.propTypes = {
  className: PropTypes.string
};

export default LatestMovies;
