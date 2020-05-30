import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import API from '../../../../services/api';
// import AddPhotoAlternateOutlined from '@material-ui/icons/AddPhotoAlternateOutlined';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' }
  }
};

const useStyles = makeStyles(theme => ({
  dialogaction: {
    padding: 20
  },
  textField: {
    marginBottom: theme.spacing(3)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10000,
    color: '#fff',
  },
  uploadField: {
    display: 'none'
  },
  avatar: {
    width: 160,
    height: 160,
    marginRight: 20
  },
  imageUpload: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
  multiInput3: {
    display: 'flex',
    '& > div:nth-of-type(2)': {
      marginLeft: 20,
      marginRight: 20
    }
  },
  multiInput2: {
    display: 'flex',
    '& > div:nth-of-type(2)': {
      marginLeft: 20
    }
  }
}));

const FormDialog = (props) => {
  const classes = useStyles();
   const { toggleSnackbarMsg } = useContext(SnackbarContext);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(props.modalOpen);
  let isNew = props.isNew

  const { toggleLoading } = useContext(GlobalContext);
  const { toggleSnackbar } = useContext(SnackbarContext);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    let mcategory = {}
    if(props.category && props.category.id){
      mcategory = { ...props.category }
    }
    setFormState(formState => ({
      ...formState,
      values: mcategory
    }));
  }, [props.category]);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleClose = () => {
    setFormState({
      isValid: false,
      values: {},
      touched: {},
      errors: {}
    })
    setOpen(false);
    props.onClose(false);
  };

  useEffect(() => {
    setOpen(props.modalOpen);
  }, [props.modalOpen])

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const handleUserChange = async (event) => {
    event.preventDefault();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
      }
    };
    const data = {
      id: formState.values.id || null,
      name: formState.values.name
    }
    try {
      toggleLoading(true);
      if (data.id) {
        await API.patch('/category/' + data.id, data, options);
      } else {
        delete data.id;
        await API.post('/category', data, options);
      }
      setSubmitted(true)
      toggleLoading(false);
      toggleSnackbar(true);
      toggleSnackbarMsg(isNew ? 'Category added' : 'Category updated');
      setFormState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
      })
      setOpen(false);
      props.onClose(true);
    } catch (error) {
      setSubmitted(false);
      toggleLoading(false)
      if(error.status === 401){
        toggleSnackbarMsg('Unauthorized')
      }else{
        toggleSnackbarMsg(error.data ? error.data.message : 'Error occured')
      }
      toggleSnackbar(true);
    }
  }

  return (
    <div>
      <Dialog maxWidth={'md'} disableBackdropClick={true} disableEscapeKeyDown={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{isNew ? 'Add category' : 'Edit category'}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleUserChange}>
            <TextField
                className={classes.textField}
                error={hasError('name')}
                fullWidth
                helperText={
                  hasError('name') ? formState.errors.name[0] : null
                }
                label="Name"
                name="name"
                onChange={handleChange}
                type="text"
                value={formState.values.name || ''}
                variant="outlined"
              />

          </form>
        </DialogContent>
        <DialogActions className={classes.dialogaction}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUserChange} disabled={!formState.isValid} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;