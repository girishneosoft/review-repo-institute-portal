"use client"

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import Rating from '@mui/material/Rating';
import { Button, Paper } from '@mui/material';

interface ProfileProps {
    handleSharePost: () => void;
}

export default function Profile({ handleSharePost }: ProfileProps) {
    return (
        <>
            <Card sx={{ boxShadow: 0 }} >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ width: 56, height: 56 }} aria-label="recipe">R</Avatar>
                        }
                        title={"Girish Bagmor"}
                        subheader={
                            <Box sx={{ fontSize: "0.755rem" }}>
                                <span>girish.bagmor</span><br />
                                <span style={{ color: "black" }}>100k connection</span>
                            </Box>
                        }
                    />
                    <Box sx={{ padding: "16px" }}>
                        <Rating name="read-only" size="small" value={4.5} readOnly />
                        <Typography variant="body2" color="text.secondary">4.5/5</Typography>
                        <Button sx={{
                            marginTop: 1,
                            fontSize: '12px',
                            padding: '2px 8px',
                            minWidth: '40px'
                        }} size='small'
                            variant='outlined'
                            onClick={handleSharePost}
                        >Share Post</Button>
                    </Box>
                </Box>
                <CardContent sx={{ paddingTop: 0, pb: "14px !important" }}>
                    <Typography variant="body2" color="text.secondary">
                        This impressive paella is a perfect party dish and a fun meal to cook
                        together with your guests. Add 1 cup of frozen peas along with the mussels,
                        if you like.
                    </Typography>
                </CardContent>
            </Card>
        </>
    )
}
