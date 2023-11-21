import { Grid, Box, Dialog, IconButton, Button } from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

interface MuiDayPickerProps {
    open: boolean;
    handleClose: any;
    handleChange: any;
    value: string | any;
}

const MuiTimeRanglePicker = ({ open, handleChange, value, handleClose }: MuiDayPickerProps) => {

    const onChange = (e: any, type: string) => {
        console.log(e, "e")
        const updated = { ...value, [type]: e };
        handleChange(updated);
    }

    return (
        <Dialog
            open={open}
            maxWidth={"xs"}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <IconButton onClick={() => handleClose(false)} sx={{ position: "absolute", top: 0, right: 0 }} color="error"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ m: 1, pb: 1 }}>
                <Grid container columnSpacing={3} >
                    <Grid item xs={6} md={6} >
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                                value={moment(value?.start)}
                                onChange={(e) => onChange(e, "start")}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} md={6} >
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                                value={moment(value?.end)}
                                onChange={(e) => onChange(e, "end")}
                                minTime={moment(value?.start)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6} md={6} >
                    </Grid>
                    <Grid item xs={6} md={6} >
                        <Box color="secondary" sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button onClick={() => handleClose(false)}>Ok</Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default MuiTimeRanglePicker;