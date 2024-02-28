import {useEffect, useState} from 'react'

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PropTypes from 'prop-types';
const ErrorDialog = ({isVisible, setVisible, title, message}) => {


    const handleClose = () => {
        setVisible(false);
    };

    return (
        <>
            <Dialog
                open={isVisible}
                onClose={handleClose}
            >
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </>)
}

ErrorDialog.propTypes = {
    isVisible: PropTypes.bool,
    setVisible: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string
}

export default ErrorDialog;