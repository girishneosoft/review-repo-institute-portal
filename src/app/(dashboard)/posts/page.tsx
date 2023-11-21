"use client"

import React, { useState, useRef } from 'react';
import Grid from '@mui/material/Grid';
import CustomButton from '@/components/CustomButton';
import Box from '@mui/material/Box';
import { Button, Paper } from '@mui/material';
import CreatePost from './CreatePost';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PortraitIcon from '@mui/icons-material/Portrait';
import Posts from "./posts"
import Profile from "./profile"
import ProfileAbout from "./profileAbout"
import ProfileActivity from "./profileActivity"

export default function Page() {
    const [activeTab, setActiveTab] = useState("activity");
    const [openCreatePost, setOpenCreatePost] = useState(false);
    const postRef = useRef<any>(null);


    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={7}>
                    <Posts ref={postRef} />
                </Grid>
                <Grid item xs={5}>
                    <Profile handleSharePost={() => setOpenCreatePost(true)} />

                    {/* <Paper sx={{ marginTop: 2, padding: 2 }} elevation={0}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <CustomButton
                                onClick={() => setActiveTab("activity")}
                                size="small"
                                active={activeTab === "activity" ? true : false}
                                startIcon={<DashboardOutlinedIcon fontSize='small' />}
                                sx={{ padding: "3px 32px" }}
                            >
                                Activity
                            </CustomButton>
                            <CustomButton
                                sx={{ padding: "3px 32px" }}
                                onClick={() => setActiveTab("about")}
                                size="small"
                                active={activeTab === "about" ? true : false}
                                startIcon={<PortraitIcon fontSize='small' />}
                            >
                                About
                            </CustomButton>
                        </Box>
                        {activeTab === "activity" && <ProfileActivity />}
                        {activeTab === "about" && <ProfileAbout />}
                    </Paper> */}
                </Grid>
            </Grid>

            {openCreatePost && <CreatePost open={openCreatePost}
                handleClose={(status) => {
                    setOpenCreatePost(false)
                    if (status) {
                        postRef.current?.refreshPost();
                    }
                }} />}
        </>
    )
}
