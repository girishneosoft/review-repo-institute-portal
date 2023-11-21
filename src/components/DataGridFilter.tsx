import { Button, Dialog, IconButton } from "@mui/material"
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';

interface DataGridFilterProps {
    open: boolean;
    handleClose: (shouldClose: boolean) => void;
    children: React.ReactNode;
    maxWidth?: string | any;
    onResetFilter?: (shouldClose: boolean) => void;
}

const DataGridFilter = ({ open, handleClose, onResetFilter, children, maxWidth = "md" }: DataGridFilterProps) => {
    return (
        <Dialog
            open={open}
            maxWidth={maxWidth}
            fullWidth={true}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Filter"}
                <IconButton onClick={() => handleClose(false)} sx={{ position: "absolute", top: 0, right: 0 }} color="error"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent >{children}</DialogContent>
            <DialogActions>
                <Button onClick={onResetFilter} color="error">Clear All</Button>
                <Button onClick={() => handleClose(true)} autoFocus>
                    Apply Filter
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DataGridFilter;