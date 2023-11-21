"use client"

import * as React from 'react';
import { Avatar, Typography, Button, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PortraitIcon from '@mui/icons-material/Portrait';
import { UserDetailsProps } from '@/types';
import moment from 'moment';


const Wrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    gap: 1
}))

const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "5px 7px",
    color: theme.palette.primary.main
}))

interface UserProfileProps {
    user: UserDetailsProps
}

export default function UserAbout({ user }: UserProfileProps) {
    return (
        <>
            <Paper elevation={1} sx={{ height: "100%" }}>
                <Title variant="subtitle2" >
                    <PortraitIcon fontSize='small' /> About
                </Title>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, background: "#fff", p: 2 }}>
                    <Wrapper>
                        <Typography variant="subtitle2" >{`Mobile number: `}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">{user.mobile || "N/A"}</Typography>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle2" >{`Email Id: `}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">{user.email || "N/A"}</Typography>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle2">Birth Date: </Typography>
                        <Typography variant="subtitle2" color="text.secondary" >{moment(user.dob).format("DD/MM/YYYY")}</Typography>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle2">Blood group: </Typography>
                        <Typography variant="subtitle2" color="text.secondary">{user.bloodGroup || "N/A"}</Typography>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle2">Gender: </Typography>
                        <Typography variant="subtitle2" color="text.secondary">{user.gender || "N/A"}</Typography>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle2">Skill:</Typography>
                        <Typography variant="subtitle2" color="text.secondary">{user.skills.toString() || "N/A"}</Typography>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle2">Hobby: </Typography>
                        <Typography variant="subtitle2" color="text.secondary">{user.hobbies.toString() || "N/A"}</Typography>
                    </Wrapper>
                    <Wrapper>
                        <Typography variant="subtitle2">Achievement: </Typography>
                        <Typography variant="subtitle2" color="text.secondary">{user.achievements.toString() || "N/A"}</Typography>
                    </Wrapper>
                </Box>
            </Paper>

        </>
    )
}
