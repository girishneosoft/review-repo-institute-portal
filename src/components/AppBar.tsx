"use client"
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { styled, alpha } from '@mui/material/styles';
import MuiAppBar, { AppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { Avatar, Box, InputBase } from '@mui/material';
import { deleteToken } from '@/app/(auth)/action';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { userInfo } from '@/utils/authentication';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import NotificationPopUp from './NotificationPopUp';
import { notificationState, setNotifications } from '@/store/notificationSlice';
import { axiosInstance } from '@/utils/axiosInstance';
import GlobalSearch from './GlobalSearch';
import { setCurrentUser } from '@/store/userSlice';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }: any) => ({
    background: "#fff",
    width: `calc(100% - ${drawerWidth}px)`,
    color: "black",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.2)",
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));



export default function AppBarComponent({ open }: { open: boolean }) {
    const dispatch = useDispatch();
    const { notifications } = useSelector(notificationState);
    const router = useRouter();
    const user = userInfo();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = async (value: any = null) => {
        setAnchorEl(null);
        handleMobileMenuClose();

        if (value === "logout") {
            await deleteToken();
            router.push('/')
        }
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        axiosInstance("/api/user_short_details").then((res) => {
            dispatch(setCurrentUser(res.data))
        })
    }, [])

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => router.push('/profile')} >Profile</MenuItem>
            <MenuItem onClick={() => router.push('/setting')} >Settings</MenuItem>
            <MenuItem onClick={() => {
                deleteToken();
                handleMenuClose("logout");
            }}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>

                <NotificationIcon notifications={notifications} />
                {/* <p>Notifications</p> */}
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen} >
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    useEffect(() => {
        axiosInstance("/api/current_user/connection_requests").then((res) => {
            dispatch(setNotifications(res.data))
        })
    }, [])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" >
                <Toolbar sx={{ minHeight: "60px !important" }}>
                    <GlobalSearch />
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {/* <IconButton size="large" color="inherit">
                            <VideocamOutlinedIcon />
                        </IconButton> */}
                        <MessageIcon />
                        <NotificationIcon notifications={notifications} />
                        <IconButton
                            size="medium"
                            // size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar sx={{ height: 35, width: 35 }} alt={user?.name} src={user?.avtarUrl} />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}

const NotificationIcon = ({ notifications }: any) => {
    let count = 0;

    const notificationCount = useMemo(() => {
        notifications.map((item: any) => {
            count = count + item.requests.length;
        })
        return count
    }, [notifications])

    return <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
            <div>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    {...bindTrigger(popupState)}
                >
                    <Badge badgeContent={notificationCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Popover
                    {...bindPopover(popupState)}
                    sx={{ top: 25, "& .MuiPaper-root": { borderRadius: "20px" } }}
                    // anchorReference="anchorPosition"
                    // anchorPosition={{ top: 200, left: 200 }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <NotificationPopUp />
                </Popover>
            </div>
        )}
    </PopupState>
}

const MessageIcon = () => {
    return <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
            <div>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    {...bindTrigger(popupState)}
                >
                    <Badge badgeContent={0} color="error">
                        <CommentOutlinedIcon />
                    </Badge>
                </IconButton>
                {/* <Popover
                    {...bindPopover(popupState)}
                    sx={{ top: 25, "& .MuiPaper-root": { borderRadius: "20px" } }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <ChatBox />
                </Popover> */}
            </div>
        )}
    </PopupState>
}