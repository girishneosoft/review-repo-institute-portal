"use client"

import * as React from 'react';
import { Avatar, Typography, Button, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { UserDetailsProps } from '@/types';

interface UserProfileProps {
    user: UserDetailsProps
}

export default function UserProfile({ user }: UserProfileProps) {
    return (
        <>
            <Paper sx={{ p: 2 }} elevation={0}>
                <Grid container spacing={2} >
                    <Grid item md={5} sm={12}>
                        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                            <Avatar
                                variant="rounded"
                                src={user.avtarUrl}
                                sx={{ width: "120px", height: "120px", borderRadius: "20px" }}
                            />
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ mt: 1 }}
                                    >
                                        {`${user.firstName} ${user.lastName}`}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary" }}
                                        display="block"
                                    >
                                        {user.userName}
                                    </Typography>
                                    <Typography variant="subtitle2" >
                                        {user.connections} connection
                                    </Typography>
                                </Box>

                                <Button variant="outlined" size="small">Message</Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item md={7} sm={12}>
                        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                            Bio
                        </Typography>
                        <Typography variant="subtitle2" >
                            {user.bio || "N/A"}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}