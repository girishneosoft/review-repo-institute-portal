"use client"
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const themeLight = createTheme({
    typography: {
        "fontFamily": ['Poppins, sans-serif'].join(','),
        "fontSize": 14,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    },
    palette: {
        background: {
            default: "#fff"
        },
    }
});

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <ThemeProvider theme={themeLight}>
            {children}
        </ThemeProvider>
    );
}
