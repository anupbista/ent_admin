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
  watchlink: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  watchtext: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  rating: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  country: {
    presence: { allowEmpty: false, message: 'is required' }
  },
  genre: {
    presence: { allowEmpty: false, message: 'is required' }
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(props.modalOpen);
  let isNew = props.isNew

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      country: ''
    },
    touched: {},
    errors: {}
  });

  useEffect(() => {
    let mmovie = {country: '', genre: ''}
    if(props.movie && props.movie.id){
      mmovie = {}
      let imagepath = props.movie.imagepath ? props.movie.imagepath.split('/') : null
      if (imagepath) {
        imagepath.shift();
        imagepath = imagepath.join('/')
        imagepath = imagepath ? URL.appURL + imagepath : null
      }
      mmovie = { ...props.movie, imagepath: imagepath, genre: props.movie.genre[0].id }
    }
    setFormState(formState => ({
      ...formState,
      values: mmovie
    }));
  }, [props.movie]);

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
    if (props.modalOpen) {
      if(!(countries.length > 0)) getCountries();
      if(!(genres.length > 0)) getGenres();
      
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
      description: formState.values.description,
      releasedate: formState.values.releasedate,
      downloadlink: formState.values.downloadlink,
      downloadtext: formState.values.downloadtext,
      watchlink: formState.values.watchlink,
      watchtext: formState.values.watchtext,
      rating: formState.values.rating,
      country: formState.values.country,
      genre: [
       {
        id: formState.values.genre
       }
      ],
      imagepath: null
    }
    try {
      setLoading(true);
      if (data.id) {
        delete data.imagepath;
        await axios.patch(URL.baseURL + 'movies/' + data.id, data, options);
      } else {
        delete data.id;
        let res = await axios.post(URL.baseURL + 'movies', data, options);
        // upload iamge
        if (file) {
          let formData = new FormData();    //formdata object
          formData.append('image', file);
          await axios.post(URL.baseURL + 'movies/' + res.id + '/image', formData, options);
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
        await axios.post(URL.baseURL + 'movies/' + formState.values.id + '/image', formData, options);
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

  const [countries, setCountries] = useState([]);

  const getCountries = async () => {
    try {
      setLoading(true);
      let res = await axios.get('https://restcountries.eu/rest/v1');
      setLoading(false);
      setCountries(res.data)
    } catch (error) {
      setLoading(false);
    }
  }

  const [genres, setGenres] = useState([]);

  const getGenres = async () => {
    try {
      setLoading(true);
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : ''
        }
      };
      let res = await axios.get(URL.baseURL + 'genre', options);
      setLoading(false);
      setGenres(res.data)
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <div>

      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={submitted && !error} autoHideDuration={3000} message={isNew ? 'Movie added' : 'Movie updated'} onClose={handleSnackbarClose}></Snackbar>

      <Dialog maxWidth={'md'} disableBackdropClick={true} disableEscapeKeyDown={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{isNew ? 'Add Movie' : 'Edit Movie'}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleUserChange}>

            <div className={classes.imageUpload}>
              <Avatar
                alt="Person"
                className={classes.avatar}
                src={fileBase64 ? fileBase64 : formState.values.imagepath ? formState.values.imagepath : "/images/movie.svg"}
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
              <TextField
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
              error={hasError('watchlink')}
              fullWidth
              label="Watchlink"
              name="watchlink"
              helperText={
                hasError('watchlink') ? formState.errors.watchlink[0] : null
              }
              onChange={handleChange}
              type="text"
              value={formState.values.watchlink || ''}
              variant="outlined"
            />
            <TextField
              className={classes.textField}
              error={hasError('watchtext')}
              fullWidth
              label="Watchtext"
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
            <FormControl variant="outlined" fullWidth className={classes.textField}>
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                id="country"
                error={hasError('country')}
                label="Country"
                name="country"
                value={formState.values.country}
                onChange={handleChange}>

                {countries.map((item, keyIndex) => {
                  return (
                  <MenuItem key={keyIndex} value={item.name}>{item.name}</MenuItem>)
                })
                }
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth className={classes.textField}>
              <InputLabel id="genre-label">Genre</InputLabel>
              <Select
                labelId="genre-label"
                id="genre"
                error={hasError('genre')}
                label="Genre"
                name="genre"
                value={formState.values.genre}
                onChange={handleChange}>
                {genres.map((item, keyIndex) => {
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