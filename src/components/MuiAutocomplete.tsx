import { FormControl, Autocomplete, InputLabel, Box, styled, TextField } from "@mui/material";

const BootstrapInput = styled(Autocomplete)(({ theme, size }) => ({
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
}));

const MuiAutocomplete = ({ label, sx, required, children, size = "medium", ...rest }: any) => {
    return (
        <>
            <FormControl variant="standard" sx={sx} fullWidth>
                {label && <InputLabel sx={{ fontSize: '1.2rem' }} shrink htmlFor="bootstrap-input">
                    {label}
                    {required && <Box component="span" sx={{ color: "error.light" }}>*</Box>}
                </InputLabel>}
                <BootstrapInput
                    variant="outlined"
                    fullWidth
                    size={size}
                    {...rest}
                >{children}
                </BootstrapInput>
            </FormControl>
        </>
    )
}

export default MuiAutocomplete;