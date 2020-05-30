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
import Avatar from '@material-ui/core/Avatar';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';
import { DatePicker } from "@material-ui/pickers";
import * as moment from 'moment';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  watchlink: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  watchtext: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  uploadedby: {
    presence: { allowEmpty: true }
  },
  category: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  uploadedchannel: {
    presence: { allowEmpty: true }
  },
};

const useStyles = makeStyles(theme => ({
  dialogaction: {
    padding: 20
  },
  textField: {
    marginBottom: theme.spacing(3)
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
  const { toggleLoading } = useContext(GlobalContext);
  const { toggleSnackbar } = useContext(SnackbarContext);
  const { toggleSnackbarMsg } = useContext(SnackbarContext);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(props.modalOpen);
  let isNew = props.isNew

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    let mvideo = { category: '', watchtext: 'YouTube', uploadedby: '', uploadedchannel: '' }
    if (props.video && props.video.id) {
      mvideo = {}
      // let imagepath = props.video.imagepath ? props.video.imagepath.split('/') : null
      // if (imagepath) {
      //   imagepath.shift();
      //   imagepath = imagepath.join('/')
      //   imagepath = imagepath ? URL.appURL + imagepath : null
      // }
      mvideo = { ...props.video, category: props.video.category[0].id }
    }
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      values: mvideo,
      errors: errors || {}
    }));
  }, [props.video]);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleDateChange = event => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        releasedate: event
      },
      touched: {
        ...formState.touched,
        releasedate: true
      }
    }));
  }

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
      values: { category: '', watchtext: 'YouTube'  },
      touched: {},
      errors: {}
    })
    setOpen(false);
    props.onClose(false);
  };

  useEffect(() => {
    setOpen(props.modalOpen);
    if (props.modalOpen) {
      if (!(categories.length > 0)) getCategories();

    }
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
      name: formState.values.name,
      uploadedby: formState.values.uploadedby,
      uploadedchannel: formState.values.uploadedchannel,
      watchlink: formState.values.watchlink,
      watchtext: formState.values.watchtext,
      category: [
        {
          id: formState.values.category
        }
      ],
    }
    try {
      toggleLoading(true);
      if (data.id) {
        await API.patch('/youtubevideos/' + data.id, data, options);
      } else {
        delete data.id;
        await API.post('/youtubevideos', data, options);
      }
      setSubmitted(true)
      toggleLoading(false);
      toggleSnackbar(true);
      toggleSnackbarMsg(isNew ? 'Video added' : 'Video updated')
      props.onClose(true);
      setFormState({
        isValid: false,
        values: { category: '', watchtext: 'YouTube'  },
        touched: {},
        errors: {}
      })
      setOpen(false);
    } catch (error) {
      setSubmitted(false);
      toggleLoading(false)
      if (error.status === 401) {
        toggleSnackbarMsg('Unauthorized')
      } else {
        toggleSnackbarMsg(error.data ? error.data.message : 'Error occured');
      }
      toggleSnackbar(true);
    }
  }

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      toggleLoading(true);
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
        }
      };
      let res = await API.get('/youtubecategory', options);
      toggleLoading(false);
      setCategories(res.data)
    } catch (error) {
      toggleLoading(false);
    }
  }

  return (
    <div>
      <Dialog maxWidth={'md'} disableBackdropClick={true} disableEscapeKeyDown={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{isNew ? 'Add Video' : 'Edit Video'}</DialogTitle>
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
            <div className={classes.multiInput2}>
              <TextField
                className={classes.textField}
                error={hasError('watchlink')}
                fullWidth
                helperText={
                  hasError('watchlink') ? formState.errors.watchlink[0] : null
                }
                label="Watch link"
                name="watchlink"
                onChange={handleChange}
                value={formState.values.watchlink || ''}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                error={hasError('watchtext')}
                fullWidth
                label="Watch text"
                name="watchtext"
                helperText={
                  hasError('watchtext') ? formState.errors.watchtext[0] : null
                }
                onChange={handleChange}
                type="text"
                value={formState.values.watchtext || ''}
                variant="outlined"
              />
            </div>
            <div className={classes.multiInput2}>
              <TextField
                className={classes.textField}
                error={hasError('uploadedby')}
                fullWidth
                helperText={
                  hasError('uploadedby') ? formState.errors.uploadedby[0] : null
                }
                label="Uploaded by"
                name="uploadedby"
                onChange={handleChange}
                value={formState.values.uploadedby || ''}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                error={hasError('uploadedchannel')}
                fullWidth
                label="Uploaded channel"
                name="uploadedchannel"
                helperText={
                  hasError('uploadedchannel') ? formState.errors.uploadedchannel[0] : null
                }
                onChange={handleChange}
                type="text"
                value={formState.values.uploadedchannel || ''}
                variant="outlined"
              />
            </div>
            <div className={classes.multiInput2}>
              <FormControl variant="outlined" fullWidth className={classes.textField}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  error={hasError('category')}
                  label="Category"
                  name="category"
                  value={formState.values.category}
                  onChange={handleChange}>
                  {categories.map((item, keyIndex) => {
                    return (
                      <MenuItem key={keyIndex} value={item.id}>{item.name}</MenuItem>)
                  })
                  }
                </Select>
              </FormControl>
            </div>

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