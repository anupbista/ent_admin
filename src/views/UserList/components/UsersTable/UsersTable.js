import React, { useState, useEffect, useContext } from 'react';
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
import UsersToolbar from '../UsersToolbar';
import DeleteDialog from '../../../../components/DialogDelete';
import API from '../../../../services/api';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';

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
  emptyRow:{
    textAlign: 'center'
  }
}));

const UsersTable = props => {
  const { headCells } = props;
  const [users, setUsers] = useState(props.users);
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [mUsers, setmUsers] = useState(users);
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleSnackbar } = useContext(SnackbarContext);

   const { toggleSnackbarMsg } = useContext(SnackbarContext);
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setUsers(props.users)
  }, [props.users]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.id);
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

  const handleEditClickOpen = (row) => {
    if (row) setIsNew(false)
    else setIsNew(true)
    setModalOpen(true);
    setUser(row)
  };

  const handleDialogClose = (loadData) => {
    props.onClose(loadData);
    setModalOpen(false);
    setUser(null);
  }

  const openDeleteModal = () => {
    setDeleteModal(true)
  }

  const handleUserDelete = async () => {
    try {
      toggleLoading(true)
      setDeleteModal(false);
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
        }
      };
      await API.delete('/users/' + selected.join(','), options);
      setSubmitted(true);
      setSelected([])
      toggleLoading(false)
      toggleSnackbar(true);
      toggleSnackbarMsg('User Deleted');
      props.onClose(true);
    } catch (error) {
      setSubmitted(false);
      toggleLoading(false)
      setDeleteModal(false)
      if(error.status === 401){
        toggleSnackbarMsg('Unathorized');
      }else{
        toggleSnackbarMsg(error.data ? error.data.message : 'Error occured');
      }
      toggleSnackbar(true);
    }
  }

  const onClose = () => {
    setDeleteModal(false)
  }

  const onSearchChangeHandler = (inputValue) => {
    setSearchInput(inputValue)
  }

  useEffect(() => {
    setmUsers(users)
    setmUsers(users.filter(user => {
      return (
        user.username.toLowerCase().search(searchInput.toLowerCase()) !== -1
      );
    }))
  }, [users,searchInput])

  return (
    <div className={classes.root}>
      <DeleteDialog deleteModalOpen={deleteModalOpen} confirmDelete={handleUserDelete} onClose={onClose} />
      <FormDialog modalOpen={modalOpen} user={user} onClose={handleDialogClose} isNew={isNew} />
      <UsersToolbar onClose={handleEditClickOpen} onOpen={onSearchChangeHandler} />
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
              rowCount={mUsers.length}
            />
            <TableBody>
              {
                mUsers.length < 1 && (
                  <TableRow>
                    <TableCell colSpan={6} className={classes.emptyRow}>
                      No user found
                    </TableCell>
                  </TableRow>
                )
                }
                {
              stableSort(mUsers, getComparator(order, orderBy))
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
                  {row.firstname} {row.middlename} {row.lastname}
                </TableCell>
                <TableCell align="left">{row.username}</TableCell>
                <TableCell align="left">{row.role}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  <IconButton aria-label="edit" onClick={() => handleEditClickOpen(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              );
            })
            }
            </TableBody>
          </Table>
        </TableContainer>
        {
          mUsers.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={mUsers.length}
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

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;
