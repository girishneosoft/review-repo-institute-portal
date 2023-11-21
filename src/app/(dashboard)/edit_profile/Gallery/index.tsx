import React, { useState, useEffect } from 'react';
import { Box, Grid, Avatar, styled, IconButton, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { axiosInstance } from '@/utils/axiosInstance';
import { GalleryProps } from '@/types';

import useConfirmation from '@/hooks/useConfirmation';
import UploadImage from "./UploadImage"

const ArchiveButton = styled(IconButton)({
    top: 0,
    right: 0,
    background: 'white',
    border: '1px solid',
    borderRadius: "5px",
    position: "absolute",
    padding: 1,
    "& :hover, :active, :focus": {
        background: 'white',
    }
})

export default function Gallery({ }) {
    const { showAlert, AlertComponent } = useConfirmation();

    const [galleries, setGalleries] = useState<GalleryProps[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const getFacilityListApi = () => {
        setIsLoading(true)
        axiosInstance.get("/api/institute/gallery/list").then((res) => {
            setGalleries(res.data)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getFacilityListApi();
    }, [])

    const onArchive = (row: GalleryProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/gallery/${row.id}`, { withCredentials: true }).then((res) => {
                        getFacilityListApi();
                    })
                }
            }
        })
    }

    return (
        <div>

            <UploadImage callApi={getFacilityListApi} />

            <Box component="div" maxWidth={"md"} sx={{ margin: "auto", mt: 2, p: 1 }}>
                <Typography sx={{ mb: 1 }}>Uploaded photos</Typography>
                <Grid container spacing={2}>
                    {galleries.map((item) => (
                        <Grid item key={item.id} md={2}>
                            <Box sx={{ position: "relative" }} >
                                <Avatar
                                    sx={{ height: 140, width: "100%" }}
                                    variant="square" src={item?.photoPath}
                                >
                                    {item?.photoPath}
                                </Avatar>
                                <ArchiveButton color="error" size="small" onClick={() => onArchive(item)}>
                                    <DeleteOutlineIcon fontSize="small" />
                                </ArchiveButton>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {AlertComponent}
        </div >
    );
}