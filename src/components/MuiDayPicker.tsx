import { Grid, Box, Dialog, IconButton } from "@mui/material"

import DialogContent from '@mui/material/DialogContent';
import { DialogTitle, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MuiDayPickerProps {
    open: boolean;
    handleClose: any;
    handleChange: any;
    value: string | any;
}

export const daysOfWeek = [
    { value: "mon", name: "Monday" },
    { value: "tue", name: "Tuesday" },
    { value: "wed", name: "Wednesday" },
    { value: "thu", name: "Thursday" },
    { value: "fri", name: "Friday" },
    { value: "sat", name: "Saturday" },
    { value: "sun", name: "Sunday" }
];

const MuiDayPicker = ({ open, handleChange, value, handleClose }: MuiDayPickerProps) => {

    const onChange = (e: any) => {
        const scheduleDays = value
        if (e.target.checked) {
            handleChange([...scheduleDays, e.target.value]);
        } else {
            const _updated = scheduleDays.filter((item: string) => item !== e.target.value)
            handleChange(_updated);
        }
    }

    return (
        <Dialog
            open={open}
            maxWidth={"xs"}
            // fullWidth={true}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <IconButton onClick={() => handleClose(false)} sx={{ position: "absolute", top: 0, right: 0 }} color="error"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent >
                <Grid container >
                    {daysOfWeek.map((item) => (
                        <Grid item xs={6} md={6} key={item.name}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={value.includes(item.value)}
                                        onChange={onChange}
                                        name="week"
                                        value={item.value}
                                        size="small"
                                    />
                                }
                                label={item.name}
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default MuiDayPicker;