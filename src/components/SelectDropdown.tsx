import { FormControl, Select, InputLabel, Box, styled, TextField, IconButton, FormHelperText } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const BootstrapInput = styled(Select)(({ theme, size, clearable }: any) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        fontSize: '1rem',
        width: '100%',
        padding: size === "small" ? '4.5px 12px' : "10px 12px",
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
    "& .MuiSelect-select": {
        paddingRight: clearable ? "56px !important" : "32px",
    }
}));

const ClearButton: any = styled(IconButton)(({ label }: any) => ({
    position: "absolute",
    right: "28px",
    top: label ? "25px" : 0,
}))

const SelectDropdown = ({
    label,
    value,
    sx,
    required,
    children,
    size = "medium",
    onChange,
    onClearInput,
    clearable = false,
    error,
    helperText,
    ...rest
}: any) => {
    return (
        <>
            <FormControl variant="standard" sx={sx} fullWidth>
                {label && <InputLabel sx={{ fontSize: '1.2rem' }} shrink htmlFor="bootstrap-input">
                    {label}
                    {required && <Box component="span" sx={{ color: "error.light" }}>*</Box>}
                </InputLabel>}
                <BootstrapInput
                    variant="outlined"
                    select
                    fullWidth
                    size={size}
                    value={value}
                    clearable={clearable}
                    onChange={onChange}
                    {...rest}
                >{children}
                </BootstrapInput>
                {value && clearable ? <ClearButton
                    label={label}
                    onClick={() => {
                        onChange({ target: { value: "" } });
                        onClearInput && onClearInput()
                    }}
                    size="small"
                ><CloseIcon fontSize="small" />
                </ClearButton> : ""}
                {error && <FormHelperText sx={{ color: "#d32f2f" }}>{helperText}</FormHelperText>}
            </FormControl>
        </>
    )
}

export default SelectDropdown;