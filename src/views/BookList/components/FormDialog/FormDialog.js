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
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { SnackbarContext } from '../../../../contexts/SnackbarContext';
import { DatePicker } from "@material-ui/pickers";
import * as moment from 'moment';

const schema = {
  name: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  description: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  releasedate: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  downloadlink: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  downloadtext: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  readlink: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  readtext: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  rating: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  publisher: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  author: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  imagepath:{
    presence: { allowEmpty: true }
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

  // const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      country: ''
    },
    touched: {},
    errors: {}
  });

  useEffect(() => {
    let mbook = {}
    if(props.book && props.book.id){
      mbook = {}
      // let imagepath = props.book.imagepath ? props.book.imagepath.split('/') : null
      // if (imagepath) {
      //   imagepath.shift();
      //   imagepath = imagepath.join('/')
      //   imagepath = imagepath ? URL.appURL + imagepath : null
      // }
      mbook = { ...props.book }
    }
    setFormState(formState => ({
      ...formState,
      values: mbook
    }));
  }, [props.book]);

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
      values: {country: '', genre: ''},
      touched: {},
      errors: {}
    })
    setOpen(false);
    if (fileBase64) {
      props.onClose(true);
    } else {
      props.onClose(false);
    }
    setFileBase64(null);
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
      name: formState.values.name,
      description: formState.values.description,
      releasedate: String(moment(formState.values.releasedate).year()),
      downloadlink: formState.values.downloadlink,
      downloadtext: formState.values.downloadtext,
      readlink: formState.values.readlink,
      readtext: formState.values.readtext,
      rating: Number(formState.values.rating) ? Number(formState.values.rating) :  0,
      author: formState.values.author,
      publisher: formState.values.publisher,
      imagepath: formState.values.imagepath ? formState.values.imagepath : null,
    }
    try {
      toggleLoading(true);
      if (data.id) {
        await API.patch('/books/' + data.id, data, options);
      } else {
        delete data.id;
        await API.post('/books', data, options);
        // upload iamge
        // if (file) {
        //   let formData = new FormData();    //formdata object
        //   formData.append('image', file);
        //   await API.post('/books/' + res.data.id + '/image', formData, options);
        // }
      }
      setSubmitted(true)
      toggleLoading(false);
      toggleSnackbarMsg(isNew ? 'Book added' : 'Book updated')
      toggleSnackbar(true);
      setFormState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
      })
      setOpen(false);
      props.onClose(true);
      setFileBase64(null)
    } catch (error) {
      setSubmitted(false);
      toggleLoading(false)
      if(error.status === 401){
        toggleSnackbarMsg('Unauthorized')
      }else{
        toggleSnackbarMsg(error.data ? error.data.message : 'Error occured');
      }
      toggleSnackbar(true);
    }
  }

  // const handleUploadClick = async (event) => {
  //   const upfile = event.target.files[0];
  //   var reader = new FileReader();
  //   reader.readAsDataURL(upfile);

  //   reader.onload = function (e) {
  //     setFileBase64(reader.result)
  //   };
  //   setFile(upfile);
  //   event.preventDefault();
  //   if (formState.values.id) {
  //     try {
  //       const options = {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
  //         }
  //       };
  //       let formData = new FormData();    //formdata object
  //       formData.append('image', upfile);
  //       setSubmitted(true)
  //       toggleLoading(true);
  //       await API.post('/' + 'books/' + formState.values.id + '/image', formData, options);
  //       toggleLoading(false);
  //       toggleSnackbar(true);
  //     } catch (error) {
  //       setFile(null);
  //       setSubmitted(false)
  //       toggleLoading(false);
  //       toggleSnackbar(true);
  //       console.log(error)
  //     }
  //   }
  // };

  return (
    <div>
      <Dialog maxWidth={'md'} disableBackdropClick={true} disableEscapeKeyDown={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{isNew ? 'Add book' : 'Edit book'}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleUserChange}>

            <div className={classes.imageUpload}>
              <Avatar
                alt="Person"
                className={classes.avatar}
                src={fileBase64 ? fileBase64 : formState.values.imagepath ? formState.values.imagepath : "/images/book.svg"}
              />
              {/* <input
                accept="image/*"
                className={classes.uploadField}
                type="file"
                id="contained-button-file"
                onChange={handleUploadClick}
              />
              <label htmlFor="contained-button-file">
                <Button component="span" color="primary">
                  <AddPhotoAlternateOutlined /> Upload image
                </Button>
              </label> */}
            </div>

            <div className={classes.multiInput2}>
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
              {/* <TextField
                className={classes.textField}
                error={hasError('releasedate')}
                fullWidth
                helperText={
                  hasError('releasedate') ? formState.errors.releasedate[0] : null
                }
                label="Released date"
                name="releasedate"
                onChange={handleChange}
                type="text"
                value={formState.values.releasedate || ''}
                variant="outlined"
              /> */}
              <DatePicker
                views={["year"]}
                disableFuture={true}
                label="Released date"
                value={moment(formState.values.releasedate) || new Date()}
                inputVariant="outlined"
                onChange={handleDateChange}
              />
            </div>
            <TextField
                className={classes.textField}
                error={hasError('description')}
                fullWidth
                helperText={
                  hasError('description') ? formState.errors.description[0] : null
                }
                label="Description"
                name="description"
                multiline
                rows={4}
                onChange={handleChange}
                type="text"
                value={formState.values.description || ''}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                error={hasError('imagepath')}
                fullWidth
                helperText={
                  hasError('imagepath') ? formState.errors.imagepath[0] : null
                }
                label="Image path"
                name="imagepath"
                onChange={handleChange}
                type="text"
                value={formState.values.imagepath || ''}
                variant="outlined"
              />
              <div className={classes.multiInput2}>
              <TextField
              className={classes.textField}
              error={hasError('downloadlink')}
              fullWidth
              helperText={
                hasError('downloadlink') ? formState.errors.downloadlink[0] : null
              }
              label="Downloadlink"
              name="downloadlink"
              onChange={handleChange}
              value={formState.values.downloadlink || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('downloadtext')}
              fullWidth
              label="Downloadtext"
              name="downloadtext"
              helperText={
                hasError('downloadtext') ? formState.errors.downloadtext[0] : null
              }
              onChange={handleChange}
              type="text"
              value={formState.values.downloadtext || ''}
              variant="outlined"
            />
              </div>
              <div className={classes.multiInput2}>
              <TextField
              className={classes.textField}
              error={hasError('readlink')}
              fullWidth
              label="Readlink"
              name="readlink"
              helperText={
                hasError('readlink') ? formState.errors.readlink[0] : null
              }
              onChange={handleChange}
              type="text"
              value={formState.values.readlink || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('readtext')}
              fullWidth
              label="Readtext"
              name="readtext"
              helperText={
                hasError('readtext') ? formState.errors.readtext[0] : null
              }
              onChange={handleChange}
              type="text"
              value={formState.values.readtext || ''}
              variant="outlined"
            />
                </div>
           
            
            <TextField
              className={classes.textField}
              error={hasError('rating')}
              fullWidth
              label="Rating"
              name="rating"
              helperText={
                hasError('rating') ? formState.errors.rating[0] : null
              }
              onChange={handleChange}
              type="text"
              value={formState.values.rating || ''}
              variant="outlined"
            />
            <div className={classes.multiInput2}>
            <TextField
              className={classes.textField}
              error={hasError('author')}
              fullWidth
              label="Author"
              name="author"
              helperText={
                hasError('author') ? formState.errors.author[0] : null
              }
              onChange={handleChange}
              type="text"
              value={formState.values.author || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('publisher')}
              fullWidth
              label="Publisher"
              name="publisher"
              helperText={
                hasError('publisher') ? formState.errors.publisher[0] : null
              }
              onChange={handleChange}
              type="text"
              value={formState.values.publisher || ''}
              variant="outlined"
            />
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