import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import URL from 'env/env.dev';
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import AddPhotoAlternateOutlined from '@material-ui/icons/AddPhotoAlternateOutlined';
import Avatar from '@material-ui/core/Avatar';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const schema = {
  firstname: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  lastname: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true
  },
  role: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
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
  }
}));

const FormDialog = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(props.modalOpen);
  let isNew = props.isNew

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      role: "Admin"
    },
    touched: {},
    errors: {}
  });

  useEffect(() => {
    let muser = {
      role: "Admin"
    }
    if (props.user) {
      let imagepath = props.user.imagepath ? props.user.imagepath.split('/') : null
      if (imagepath) {
        imagepath.shift();
        imagepath = imagepath.join('/')
        imagepath = imagepath ? URL.appURL + imagepath : null
      }
      muser = { ...props.user, imagepath: imagepath, role: "Admin" }
    }
    setFormState(formState => ({
      ...formState,
      values: muser
    }));
  }, [props.user]);

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
    console.log(event.target)
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
      firstname: formState.values.firstname,
      middlename: formState.values.middlename,
      lastname: formState.values.lastname,
      role: formState.values.role,
      email: formState.values.email,
      username: formState.values.username,
      imagepath: null
    }
    try {
      setLoading(true);
      if (data.id) {
        delete data.imagepath;
        await axios.patch(URL.baseURL + 'users/' + data.id, data, options);
      } else {
        delete data.id;
        let res = await axios.post(URL.baseURL + 'users', data, options);
        // upload iamge
        if(file){
          let formData = new FormData();    //formdata object
          formData.append('image', file);
          await axios.post(URL.baseURL + 'users/' + res.id + '/image', formData, options);
        }
      }
      setSubmitted(true)
      setLoading(false);
      setError(false);
      props.onClose(true);
      setFileBase64(null)
    } catch (error) {
      setSubmitted(false)
      setLoading(false);
      setError(true);
      console.log(error)
    }
  }

  const handleSnackbarClose = () => {
    setSubmitted(false)
  }

  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  const handleUploadClick = async (event) => {
    const upfile = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(upfile);

    reader.onload = function (e) {
      setFileBase64(reader.result)
    };
    setFile(upfile);
    event.preventDefault();
    if (formState.values.id) {
      try {
        const options = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
          }
        };
        let formData = new FormData();    //formdata object
        formData.append('image', upfile);
        setSubmitted(true)
        setLoading(true);
        await axios.post(URL.baseURL + 'users/' + formState.values.id + '/image', formData, options);
        setLoading(false);
        setError(false);
      } catch (error) {
        setFile(null);
        setSubmitted(false)
        setLoading(false);
        setError(true);
        console.log(error)
      }
    }
  };

  return (
    <div>

      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={submitted && !error} autoHideDuration={3000} message={isNew ? 'User added' : 'User updated'} onClose={handleSnackbarClose}></Snackbar>

      <Dialog disableBackdropClick={true} disableEscapeKeyDown={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{isNew ? 'Add User' : 'Edit User'}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleUserChange}>

            <div className={classes.imageUpload}>
              <Avatar
                alt="Person"
                className={classes.avatar}
                src={fileBase64 ? fileBase64 : formState.values.imagepath ? formState.values.imagepath : "/images/avatars/avatar-male.svg"}
              />
              <input
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
              </label>
            </div>

            <TextField
              className={classes.textField}
              error={hasError('firstname')}
              fullWidth
              helperText={
                hasError('firstname') ? formState.errors.firstname[0] : null
              }
              label="Firstname"
              name="firstname"
              onChange={handleChange}
              type="text"
              value={formState.values.firstname || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('middlename')}
              fullWidth
              helperText={
                hasError('middlename') ? formState.errors.middlename[0] : null
              }
              label="Middlename"
              name="middlename"
              onChange={handleChange}
              type="text"
              value={formState.values.middlename || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('lastname')}
              fullWidth
              helperText={
                hasError('lastname') ? formState.errors.lastname[0] : null
              }
              label="Lastname"
              name="lastname"
              onChange={handleChange}
              type="text"
              value={formState.values.lastname || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('email')}
              fullWidth
              helperText={
                hasError('email') ? formState.errors.email[0] : null
              }
              label="Email"
              name="email"
              onChange={handleChange}
              type="email"
              value={formState.values.email || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('username')}
              fullWidth

              label="Username"
              name="username"
              onChange={handleChange}
              type="text"
              value={formState.values.username || ''}
              variant="outlined"
            />
            <FormControl variant="outlined" fullWidth className={classes.textField}>
              <InputLabel id="user-role-label">Role</InputLabel>
              <Select
                labelId="user-role-label"
                id="user-role"
                error={hasError('role')}
                label="Role"
                name="role"
                value={formState.values.role || 'Admin'}
                onChange={handleChange}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem disabled value="Moderator">Moderator</MenuItem>
              </Select>
            </FormControl>
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