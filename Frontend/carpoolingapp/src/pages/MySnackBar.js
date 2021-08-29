import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import React from 'react'

export default function MySnackBar(props)
{
    let open = props.open
    const message = props.message
    return(
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={props.handleClose}
      >
  <SnackbarContent style={{
      backgroundColor:'white',
      color:'#0a91ca',
      fontSize: '17px',
    }}
    message={<span id="client-snackbar">{message}</span>}
    />
    </Snackbar>
    )
}