import React from 'react';
import { Box, Grid, Avatar, styled, IconButton, Typography } from '@mui/material';
import { axiosInstance } from '@/utils/axiosInstance';
import { GalleryProps } from '@/types';

async function getGalleryApi() {
    const res = await axiosInstance.get('/api/institute/gallery/list');
    return res.data;
}

export default async function Gallery() {
    const galleries: GalleryProps[] = await getGalleryApi();

    return (
        <div>
            <Box component="div" sx={{ margin: "auto", mt: 2, p: 1 }}>
                <Grid container spacing={1}>
                    {galleries.map((item) => (
                        <Grid item key={item.id} md={2}>
                            <Box sx={{ position: "relative" }} >
                                <Avatar
                                    sx={{ height: 140, width: "100%" }}
                                    variant="square"
                                    src={item?.photoPath}
                                >
                                    {item?.photoPath}
                                </Avatar>
                                {/* <ArchiveButton color="error" size="small" onClick={() => onArchive(item)}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </ArchiveButton> */}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div >
    );
}