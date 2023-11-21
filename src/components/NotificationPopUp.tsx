import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { notificationState, setNotifications } from '@/store/notificationSlice';
import { axiosInstance } from '@/utils/axiosInstance';
import { toastMessage } from '@/utils/toastify';

export default function NotificationPopUp() {
    const { notifications } = useSelector(notificationState);
    const dispatch = useDispatch();

    const acceptOrRejectRequest = (item: any, status: string, i: number, subI: number) => {
        axiosInstance.post(`/api/current_user/accept_or_reject_connection_request/${item.id}`, {
            status: status
        }).then((res) => {
            toastMessage(res.data.message, "s");
            let _notifications = JSON.parse(JSON.stringify(notifications));
            console.log(_notifications[i]['requests'][subI], "_notifications")
            _notifications[i]['requests'][subI] = { ..._notifications[i]['requests'][subI], status };

            dispatch(setNotifications(_notifications));
        })
    }

    return (
        <React.Fragment>
            <Typography variant="subtitle1" gutterBottom component="div" sx={{ p: 2, pt: 1.5, pb: 1.5, backgroundColor: "primary.main", m: 0, color: "#fff" }}>
                Requests
            </Typography>
            <Paper square sx={{ pb: '50px', width: 300, height: 400, boxShadow: 'none', overflowX: "scroll" }}>
                <List sx={{ mb: 2, pt: 0 }}>
                    {notifications.map((item, i) => (
                        <React.Fragment key={item.date}>
                            <ListSubheader sx={{ bgcolor: '#F0F3FF', lineHeight: "32px" }}>
                                {moment(item.date).format("DD MMM YYYY")}
                            </ListSubheader>

                            {item?.requests.map((val, subI) => (
                                <ListItem key={val.id} sx={{ pb: 2 }} >
                                    <ListItemAvatar>
                                        <Avatar alt="Profile Picture" src={val?.sender?.avtarUrl} sx={{ mr: 2 }} />
                                    </ListItemAvatar>
                                    <Box>
                                        <Typography variant="subtitle2">{val?.senderName}</Typography>
                                        {val.status && <Typography>{val.status === "accept" ? "Request accepted" : "Request declined"}</Typography>}

                                        {!val.status && <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                            <Button variant='contained' size="small" sx={{ mr: 2 }} onClick={() => acceptOrRejectRequest(val, "accept", i, subI)}>Confirm</Button>
                                            <Button variant='outlined' size="small" onClick={() => acceptOrRejectRequest(val, "reject", i, subI)}>Cancel</Button>
                                        </Box>}
                                    </Box>
                                </ListItem>
                            ))}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </React.Fragment>
    );
}