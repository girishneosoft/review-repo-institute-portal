import { createTheme } from '@mui/material/styles';

export const themeLight = createTheme({
    typography: {
        "fontFamily": ['Poppins, sans-serif'].join(','),
        "fontSize": 14,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    },
    palette: {
        background: {
            default: "#F5F7F9"
        },
        primary: {
            main: '#2C6EF2',
        },
    }
});