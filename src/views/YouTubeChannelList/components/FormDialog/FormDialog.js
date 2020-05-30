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
  channellink: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  imagepath:{
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
  // const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    let myoutubechannel = {}
    if(props.youtubechannel && props.youtubechannel.id){
      myoutubechannel = {}
      // let imagepath = props.youtubechannel.imagepath ? props.youtubechannel.imagepath.split('/') : null
      // if (imagepath) {
      //   imagepath.shift();
      //   imagepath = imagepath.join('/')
      //   imagepath = imagepath ? URL.appURL + imagepath : null
      // }
      myoutubechannel = { ...props.youtubechannel}
    }
    setFormState(formState => ({
      ...formState,
      values: myoutubechannel
    }));
  }, [props.youtubechannel]);

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
      values: {},
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
      channellink: formState.values.channellink,
      imagepath: formState.values.imagepath ? formState.values.imagepath: null
    }
    try {
      toggleLoading(true);
      if (data.id) {
        await API.patch('/youtubechannels/' + data.id, data, options);
      } else {
        delete data.id;
        await API.post('/youtubechannels', data, options);
        // upload iamge
        // if (file) {
        //   let formData = new FormData();    //formdata object
        //   formData.append('image', file);
        //   await API.post('/' + 'youtubechannels/' + res.data.id + '/image', formData, options);
        // }
      }
      setSubmitted(true)
      toggleLoading(false);
      toggleSnackbar(true);
      toggleSnackbarMsg(isNew ? 'YouTubeChannel added' : 'YouTubeChannel updated')
      props.onClose(true);
      setFormState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
      })
      setOpen(false);
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
  //       await API.post('/' + 'youtubechannels/' + formState.values.id + '/image', formData, options);
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
        <DialogTitle id="form-dialog-title">{isNew ? 'Add YouTubeChannel' : 'Edit YouTubeChannel'}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleUserChange}>

            <div className={classes.imageUpload}>
              <Avatar
                alt="Person"
                className={classes.avatar}
                src={fileBase64 ? fileBase64 : formState.values.imagepath ? formState.values.imagepath : "/images/youtubechannel.svg"}
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
              <TextField
              className={classes.textField}
              error={hasError('channellink')}
              fullWidth
              helperText={
                hasError('channellink') ? formState.errors.channellink[0] : null
              }
              label="Channel link"
              name="channellink"
              onChange={handleChange}
              value={formState.values.channellink || ''}
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