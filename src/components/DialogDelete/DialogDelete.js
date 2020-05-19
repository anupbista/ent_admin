import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    content: {
      minWidth: 350
    }
  }));

export default function DeleteDialog(props) {
    const classes = useStyles();
  const [open, setOpen] = useState(props.deleteModalOpen);

  useEffect( () => {
      setOpen(props.deleteModalOpen);
  }, [props.deleteModalOpen])

  const handleClose = () => {
    setOpen(false);
    props.onClose()
  };

  const handleOk = () => {
    props.confirmDelete();
  };

  return (
    <div>
      <Dialog disableBackdropClick={true} disableEscapeKeyDown={true}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Delete?"}</DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText id="alert-dialog-description">
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}