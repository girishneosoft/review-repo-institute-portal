import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export interface ShowAlertAction {
    title?: string;
    message?: string;
    onAction?: (action: string) => void;
}

const useConfirmation = () => {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = useState('Confirmation');
    const [message, setMessage] = useState('Are you sure you want to do this action?');
    const [handleAction, setHandleAction] = useState<any>(null);

    const showAlert = (props: ShowAlertAction = {}) => {
        const { title, message, onAction } = props;

        title && setTitle(title);
        message && setMessage(message);
        onAction && setHandleAction(() => onAction);
        setOpen(true);
    };

    const hideAlert = (action: string) => {
        setOpen(false);
        if (handleAction) {
            handleAction(action);
        }
    };

    const AlertComponent = (
        <div>
            <Dialog
                open={open}
                onClose={() => hideAlert('cancel')}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" onClick={() => hideAlert('cancel')}>
                        Cancel
                    </Button>
                    <Button onClick={() => hideAlert('ok')} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    return {
        showAlert,
        hideAlert,
        AlertComponent,
    };
};

export default useConfirmation;
