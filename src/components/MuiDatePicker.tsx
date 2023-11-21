import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as Picker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { FormControl, InputLabel, styled, Box } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';

interface MuiDatePickerProps extends DatePickerProps<Moment> {
    label: string,
    size?: string;
    required?: boolean;
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    value?: Moment | any;
    isMobile?: boolean
}

const DatePicker: any = styled(Picker)(({ theme, size }: any) => ({
    "& .MuiFormControl-root": { marginTop: 0 },
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        fontSize: '1rem',
        width: '100%',
        padding: size === "small" ? '5.5px 12px' : "10px 12px",
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
}));


// eslint-disable-next-line react/display-name
const MuiDatePicker = React.forwardRef((props: MuiDatePickerProps, ref: any) => {
    const {
        label, value, sx, required, fullWidth, isMobile = false, error, helperText, ...rest
    } = props;

    return (
        <FormControl variant="standard" sx={sx} size={"small"} fullWidth>
            {label && <InputLabel sx={{ fontSize: '1.2rem', lineHeight: "1.3375em" }} shrink>
                {label}
                {required && <Box component="span" sx={{ color: "error.light" }}>*</Box>}
            </InputLabel>}
            <LocalizationProvider dateAdapter={AdapterMoment}>
                {isMobile && <MobileDatePicker
                    ref={ref}
                    slotProps={{ textField: { size: 'small', style: { width: fullWidth ? '100%' : "auto" } } }}
                    label={""}
                    value={moment(value)}
                    {...rest}
                />}
                {!isMobile && <DatePicker
                    ref={ref}
                    slotProps={{
                        textField: {
                            size: 'small',
                            style: { width: fullWidth ? '100%' : "auto" },
                            error: error,
                            helperText: helperText
                        }
                    }}
                    label={""}
                    value={moment(value)}
                    {...rest}
                />}
            </LocalizationProvider>
        </FormControl>
    );
});

export default MuiDatePicker;