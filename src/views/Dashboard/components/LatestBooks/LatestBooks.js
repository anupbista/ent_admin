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


const LatestBooks = props => {
  const { className, books, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Latest Books Added"
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map(book => (
                  <TableRow
                    hover
                    key={book.id}
                  >
                    <TableCell>{book.name}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.rating}</TableCell>
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
          component={Link} to="/books">
          View all <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LatestBooks.propTypes = {
  className: PropTypes.string
};

export default LatestBooks;
