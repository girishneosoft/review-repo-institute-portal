"use client"
import React, { useEffect, useMemo } from 'react';
import { ThemeProvider, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@/components/AppBar';
import Drawer from '@/components/Drawer';
import { getToken } from '@/app/(auth)/action';
import { useRouter, usePathname } from 'next/navigation';
import { themeLight } from "@/theme"
import { DrawerHeader } from "@/components/DrawerHeader";
import { Provider } from 'react-redux'
import { store } from '@/store';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    background: theme.palette.background.default,
    width: `calc(100% - ${drawerWidth}px)`,
    flexGrow: 1,
    padding: "14px 21px",
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
    params: {
        tag: string
        item: string
    }
}

export default function DashboardLayout({ children, params }: LayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
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
    }, [pathname])

    const noHeader = useMemo(() => {
        const regexArray = [/create/, /profile/, /class_activities/, /^\/classes\/\d+\/subjects$/, /^\/classes\/\d+\/students$/, /^\/library\/\d+$/, /^\/library\/\d+\/reading$/, /^\/exams\/add$/];
        return regexArray.some((regex) => regex.test(pathname));
    }, [pathname]);

    const noSidebar = useMemo(() => {
        const regexArray = [/create/, /^\/classes\/\d+\/subjects$/, /^\/classes\/\d+\/students$/, /^\/library\/\d+$/, /^\/library\/\d+\/reading$/, /edit_profile/, /^\/exams\/add$/];
        return regexArray.some((regex) => regex.test(pathname));
    }, [pathname]);

    return (
        <Provider store={store}>
            <ThemeProvider theme={themeLight}>
                <Box sx={{ display: 'flex', height: "100%" }}>
                    <CssBaseline />
                    {!noHeader && <AppBar open={open} />}
                    {!noSidebar && <Drawer handleDrawerClose={handleDrawerClose} open={open} />}

                    <Main open={open} >
                        {!noHeader && <DrawerHeader />}
                        <Box sx={{ display: "flex", flexDirection: "column", height: `calc(100% - ${noHeader ? 0 : 64}px)` }}>
                            {children}
                        </Box>
                    </Main>
                </Box>
            </ThemeProvider>
        </Provider>
    );
}
