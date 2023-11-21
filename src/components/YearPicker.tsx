import React from 'react';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Moment } from 'moment';
import Input from './InputComponent';
import { Box, FormControl, InputLabel, TextField, styled } from '@mui/material';

interface YearPickerProps extends DatePickerProps<Moment> {
    size?: string;
    required?: boolean;
    fullWidth?: boolean;
}

const MuiDatePicker: any = styled(DatePicker)(({ theme, size }: any) => ({
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


export default function YearPicker({ label, value, sx, size, fullWidth, required, onChange, ...rest }: YearPickerProps) {
    console.log(value, "value")
    return (
        <>
            <FormControl variant="standard" sx={sx} size={"small"} >
                {label && <InputLabel sx={{ fontSize: '1.2rem', lineHeight: "1.3375em" }} shrink htmlFor="bootstrap-input">
                    {label}
                    {required && <Box component="span" sx={{ color: "error.light" }}>*</Box>}
                </InputLabel >}
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <MuiDatePicker
                        slotProps={{ textField: { size: 'small', style: { width: fullWidth ? '100%' : "auto" } } }}
                        label={''}
                        views={['year']}
                        value={value}
                        onChange={onChange}
                        {...rest}
                        size={size}
                    />
                </LocalizationProvider>
            </FormControl>
        </>
    )
}
