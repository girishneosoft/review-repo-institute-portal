"use client"
import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, styled, useTheme, withStyles } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import GroupsIcon from '@mui/icons-material/Groups';
import List from '@mui/material/List';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PersonIcon from '@mui/icons-material/Person';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Typography, Collapse } from '@mui/material';
import { MenuProps } from '@/types';
import { userInfo } from '@/utils/authentication';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

interface AppDrawerInterface {
    open: boolean;
    handleDrawerClose: any
}

const managementActive = ["timetable", "transport", "culture", "sports", "canteen", "complaint"];
const menus: MenuProps[] = [
    {
        name: "Apps",
        menus: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: <HomeOutlinedIcon />,
                active: ["dashboard"]
            },
            {
                name: "Post",
                path: "/posts",
                icon: <DashboardOutlinedIcon />,
                active: ["posts"]
            }
        ]
    },
    {
        name: "Menu",
        menus: [
            {
                name: "Students",
                path: "/students",
                icon: <PersonIcon />,
                active: ["students"]
            },
            {
                name: "Staff",
                path: "/staff",
                icon: <GroupsIcon />,
                active: ["staff"]
            },
            {
                name: "Class",
                path: "/classes",
                icon: <DashboardOutlinedIcon />,
                active: ["classes"]
            }
        ]
    },
    {
        name: "Other",
        menus: [
            {
                name: "Management",
                path: "#!",
                icon: <ManageAccountsOutlinedIcon />,
                active: managementActive,
                menus: [
                    {
                        name: "Timetable",
                        active: "timetable",
                        path: "/timetable",
                        icon: <LanguageOutlinedIcon />
                    },
                    {
                        name: "Transport",
                        active: "transport",
                        path: "/transport/team-members",
                        icon: <LanguageOutlinedIcon />
                    },
                    {
                        name: "Culture",
                        active: "culture",
                        path: "/culture/team-members",
                        icon: <LanguageOutlinedIcon />
                    },
                    {
                        name: "Sports",
                        active: "sports",
                        path: "/sports/team-members",
                        icon: <LanguageOutlinedIcon />
                    },
                    {
                        name: "Canteen",
                        active: "canteen",
                        path: "/canteen/team-members",
                        icon: <LanguageOutlinedIcon />
                    },
                    {
                        name: "Complaint",
                        active: "complaint",
                        path: "/complaints",
                        icon: <LanguageOutlinedIcon />
                    }
                ]
            },
            {
                name: "Exam",
                path: "/exams",
                icon: <LanguageOutlinedIcon />,
                active: ["exams"]
            },
            {
                name: "Assignment",
                path: "/assignment",
                icon: <AssignmentIndOutlinedIcon />,
                active: ["assignment"]
            },
            {
                name: "Library",
                path: "/library",
                icon: <ImportContactsOutlinedIcon />,
                active: ["library"]
            }
        ]
    }
]

const MuiListItem = styled(ListItem)(({ theme }) => ({
    ".Mui-selected": {
        backgroundColor: "#F0F3FF",
        color: "#2C6EF2",
        "& .MuiListItemIcon-root": {
            color: "#2C6EF2",
            marginLeft: "15px",
        },
        borderLeft: "5px solid #2C6EF2"
    },
    ":hover": {
        backgroundColor: "#F0F3FF",
        color: "#2C6EF2",
        ".MuiListItemIcon-root": {
            color: "#2C6EF2",
        },
        "::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "5px",
            height: "100%",
            backgroundColor: "#2C6EF2"
        }
    }
}));

export default function Drawer({ handleDrawerClose, open }: AppDrawerInterface) {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    useEffect(() => {
        if (managementActive.some((slug: string) => pathname.includes(slug))) {
            setSubMenuOpen(true)
        }

    }, [pathname])

    return (
        <MuiDrawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader sx={{ display: "flex", justifyContent: "center" }} >
                <Typography variant="h4" component="h2" color="primary">alpha</Typography>
            </DrawerHeader>
            <List>
                {menus.map((menu) => (
                    <React.Fragment key={menu.name}>
                        <ListItem key={menu.name} sx={{ fontWeight: 500, color: "black" }}>
                            {menu.name}
                        </ListItem >
                        {
                            menu.menus.map((item) => (
                                <React.Fragment key={item.name}>
                                    <MuiListItem key={item.name} disablePadding sx={{ color: 'text.secondary' }} >
                                        <ListItemButton
                                            component={Link}
                                            href={item.path}
                                            sx={{ padding: "3px", paddingLeft: "10px" }}
                                            selected={item.active && item.active?.some((slug: string) => pathname.includes(slug))}
                                            onClick={() => {
                                                if (item.path === "#!") {
                                                    setSubMenuOpen(!subMenuOpen)
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ marginLeft: "20px", minWidth: "38px", color: '#90969D' }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} />
                                            {item?.menus && item?.menus.length > 0 && <>
                                                {subMenuOpen ? <ExpandLess sx={{ marginRight: "14px" }} />
                                                    : <ExpandMore sx={{ marginRight: "14px" }} />
                                                }
                                            </>}
                                        </ListItemButton>
                                    </MuiListItem>

                                    {item?.menus && item?.menus.length > 0 && subMenuOpen &&
                                        <Collapse in={open} timeout="auto" unmountOnExit key={`collapse-${item.name}`}>
                                            <List disablePadding>
                                                {item.menus.map((subMenu) => (
                                                    <ListItem key={subMenu.path}
                                                        disablePadding
                                                        sx={{
                                                            color: pathname.includes(subMenu.active) ? '#2C6EF2' : 'text.secondary'
                                                        }}
                                                    >
                                                        <ListItemButton
                                                            component={Link}
                                                            href={subMenu.path}
                                                            sx={{ p: 0, pb: "1px", pt: "1px" }}
                                                        >
                                                            <ListItemIcon sx={{ marginLeft: "28px", minWidth: "38px", color: '#90969D' }}>
                                                                {pathname.includes(subMenu.active) ?
                                                                    <RadioButtonCheckedIcon sx={{ height: 10, }} color="primary" /> :
                                                                    <RadioButtonUncheckedIcon sx={{ height: 10, }} />}

                                                            </ListItemIcon>
                                                            <ListItemText sx={{ margin: 0 }} primary={subMenu.name} /></ListItemButton>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse >
                                    }
                                </React.Fragment>
                            ))
                        }
                    </React.Fragment>
                ))}
            </List>
        </MuiDrawer >
    );
}
