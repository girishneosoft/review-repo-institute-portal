"use client"
import React, { useEffect } from 'react';
import { ThemeProvider, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@/components/AppBar';
import Drawer from '@/components/Drawer';
import { getToken } from '@/app/(auth)/action';
import { useRouter } from 'next/navigation';
import { themeLight } from "@/theme"
import { DrawerHeader } from "@/components/DrawerHeader"
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    width: `calc(100% - ${drawerWidth}px)`,
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

interface LayoutProps {
    children: React.ReactNode;
    noHeader?: boolean
}

export default function DashboardLayout({ children, noHeader = false }: LayoutProps) {
    const router = useRouter();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const checkAuthentication = async () => {
        const token = await getToken();
        if (!token) {
            router.push('/')
        }
    }

    useEffect(() => {
        checkAuthentication();
    }, [])

    return (
        <ThemeProvider theme={themeLight}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                {!noHeader && <AppBar open={open} />}
                <Drawer handleDrawerClose={handleDrawerClose} open={open} />

                <Main open={open} >
                    {!noHeader && <DrawerHeader />}
                    {children}
                </Main>
            </Box>
        </ThemeProvider>
    );
}
