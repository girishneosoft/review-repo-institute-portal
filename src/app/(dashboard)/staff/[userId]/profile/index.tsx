"use client"

import React, { useState } from 'react';
import { Avatar, Typography, Button, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { PostProps, UserDetailsProps } from '@/types';
import UserProfile from '@/components/User/UserProfile';
import UserAbout from '@/components/User/UserAbout';
import UserActivity from '@/components/User/UserActivity';
import SwitchProfileActivity from '../SwitchProfileActivity';

interface UserProfileProps {
    user: UserDetailsProps;
    posts: PostProps[];
    params: {
        userId: string
    }
}

export default function UserProfilePage({ user, posts, params }: UserProfileProps) {
    return (
        <>
            <SwitchProfileActivity
                hrefPrimary={`/staff/${params?.userId}/profile`}
                hrefSecondary={`/staff/${params?.userId}/class_activities`}
                activePrimary={true}
                activeSecondary={false}
            />

            <UserProfile user={user} />

            <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item md={8} sm={12}>
                    <UserActivity posts={posts} />
                </Grid>
                <Grid item md={4} sm={12} >
                    <UserAbout user={user} />
                </Grid>
            </Grid >
        </>
    )
}
