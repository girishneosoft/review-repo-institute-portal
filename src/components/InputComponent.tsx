import { FormControl, TextField, InputLabel, styled, TextFieldProps, Box } from "@mui/material";

const BootstrapInput: any = styled(TextField)(({ theme, size, inputSx }: any) => ({
    'label + &': {
        marginTop: theme.spacing(3),
        fontSize: size === "small" ? '0.8rem' : '1.2rem',
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
        fontSize: '1rem',
        width: '100%',
        padding: size === "small" ? '4.5px 12px !important' : "10px 12px !important",
        // transition: theme.transitions.create([
        //     'border-color',
        //     'background-color',
        //     'box-shadow',
        // ]),
        ...inputSx
    },
}));

type InputProps = TextFieldProps & {
    inputSx?: React.CSSProperties;
    required?: boolean;
}

const Input = ({ label, sx, inputSx = {}, size = "medium", required, autoComplete, ...rest }: InputProps) => {
    return (
        <>
            <FormControl variant="standard" sx={sx} size={"small"} fullWidth>
                {label && <InputLabel sx={{ fontSize: '1.2rem' }} shrink htmlFor="bootstrap-input">
                    {label}
                    {required && <Box component="span" sx={{ color: "error.light" }}>*</Box>}
                </InputLabel>}
                <BootstrapInput
                    fullWidth
                    size={size}
                    inputSx={inputSx}
                    autoComplete={autoComplete}
                    {...rest}
                />
            </FormControl>
        </>
    )
}

export default Input;