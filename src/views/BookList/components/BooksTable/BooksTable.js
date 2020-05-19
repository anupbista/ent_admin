import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import EnhancedTableToolbar from '../EnhancedToolbar';
import EnhancedTableHead from '../EnhancedTableHead';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import FormDialog from '../FormDialog';
import BooksToolbar from '../BooksToolbar';
import DeleteDialog from '../../../../components/DialogDelete';
import axios from 'axios';
import URL from 'env/env.dev';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Rating from '@material-ui/lab/Rating';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10000,
    color: '#fff',
  },
  emptyRow:{
    textAlign: 'center'
  }
}));

const BooksTable = props => {
  const { headCells } = props;
  const [books, setBooks] = useState(props.books);

  useEffect(() => {
    setBooks(props.books)
  }, [props.books]);

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = books.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    event.preventDefault();
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, books.length - page * rowsPerPage);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModal] = useState(false);
  const [book, setMovie] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const handleEditClickOpen = (row) => {
    if (row) setIsNew(false)
    else setIsNew(true)
    setModalOpen(true);
    setMovie(row)
  };

  const handleDialogClose = (loadData) => {
    props.onClose(loadData);
    setModalOpen(false);
    setMovie(null);
  }

  const openDeleteModal = () => {
    setDeleteModal(true)
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleMovieDelete = async () => {
    try {
      setDeleteModal(false);
      setLoading(true);
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
        }
      };
      await axios.delete(URL.baseURL + 'books/' + selected.join(','), options);
      setSubmitted(true);
      setSelected([])
      setLoading(false);
      setError(false);
      props.onClose(true);
    } catch (error) {
      setLoading(false);
      setSubmitted(false);
      setError(true);
      setDeleteModal(false)
      console.log(error)
    }
  }

  const onClose = () => {
    setDeleteModal(false)
  }

  const handleSnackbarClose = () => {
    setSubmitted(false)
  }

  const [searchInput, setSearchInput] = useState('');
  const [mBooks, setmBooks] = useState(books);

  const onSearchChangeHandler = (inputValue) => {
    setSearchInput(inputValue)
  }

  useEffect(() => {
    setmBooks(books)
    setmBooks(books.filter(book => {
      return (
        book.name.toLowerCase().search(searchInput.toLowerCase()) !== -1
      );
    }))
  }, [books,searchInput])

  return (
    <div className={classes.root}>
      <Snackbar open={submitted && !error} autoHideDuration={3000} message="Book deleted" onClose={handleSnackbarClose}></Snackbar>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DeleteDialog deleteModalOpen={deleteModalOpen} confirmDelete={handleMovieDelete} onClose={onClose} />
      <FormDialog modalOpen={modalOpen} book={book} onClose={handleDialogClose} isNew={isNew} />
      <BooksToolbar onClose={handleEditClickOpen} onOpen={onSearchChangeHandler} />
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} openDeleteModal={openDeleteModal} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              headCells={headCells}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={mBooks.length}
            />
            <TableBody>
              {
                mBooks.length < 1 && (
                  <TableRow>
                    <TableCell colSpan={6} className={classes.emptyRow}>
                      No book found
                    </TableCell>
                  </TableRow>
                )
                }
                {
              stableSort(mBooks, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
              return (
                    <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    onClick={(event) => handleClick(event, row.id)}
                    checked={isItemSelected}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </TableCell>
                <TableCell component="th" id={labelId} scope="row" padding="none">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">{row.releasedate}</TableCell>
                <TableCell align="left">{row.author}</TableCell>
                <TableCell align="left">{row.publisher}</TableCell>
                <TableCell align="left">
                  <IconButton aria-label="edit" onClick={() => handleEditClickOpen(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              );
            })
            }
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {
          mBooks.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={mBooks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )
        }
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
};

BooksTable.propTypes = {
  className: PropTypes.string,
  books: PropTypes.array.isRequired
};

export default BooksTable;
