"use client"

import * as React from 'react';
import { Avatar, Typography, Button, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { PostProps, UserDetailsProps } from '@/types';

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
    posts: PostProps[];
}

export default function UserActivity({ posts }: UserProfileProps) {
    return (
        <>
            <Paper elevation={1} sx={{ height: "100%" }}>
                <Title variant="subtitle2" >
                    <DashboardOutlinedIcon fontSize='small' />  Activity
                </Title>
                <ImageList sx={{ p: 2, background: "#fff" }} cols={5} rowHeight={120}>
                    {posts && posts.map((item: PostProps) => (
                        <>
                            {item.photos.map((photo) => (
                                <ImageListItem key={photo.pathUrl}>
                                    <img
                                        src={`${photo.pathUrl}?w=120&h=120&fit=crop&auto=format`}
                                        srcSet={`${photo.pathUrl}?w=120&h=120&fit=crop&auto=format&dpr=2 2x`}
                                        alt={item.title}
                                    // loading="lazy"
                                    />
                                </ImageListItem>
                            ))
                            }
                        </>
                    ))}
                </ImageList>
            </Paper >
        </>
    )
}

const itemData = [
    {
        img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        title: 'Breakfast',
    },
    {
        img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        title: 'Burger',
    },
    {
        img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        title: 'Camera',
    },
    {
        img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        title: 'Coffee',
    },
    {
        img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        title: 'Hats',
    },
    {
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        title: 'Honey',
    },
    {
        img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        title: 'Basketball',
    },
    {
        img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        title: 'Fern',
    },
    {
        img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        title: 'Mushrooms',
    }
];