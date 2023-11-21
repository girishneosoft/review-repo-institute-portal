"use client"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { axiosInstance } from "@/utils/axiosInstance";
import { styled, Box, Button, IconButton, Paper, Typography, Grid, Avatar } from "@mui/material";

import { useEffect, useState } from "react";
import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '@/components/Loader';

const Wrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    gap: 4
}))

const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "5px 7px",
    color: theme.palette.primary.main
}))


export default function Page() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [data, setData] = useState<{ loading: boolean, rows: any[] }>({
        loading: true,
        rows: []
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/sport/competition/list").then((res) => {
            updateData("rows", res.data);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [])

    const onArchive = (row: any) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/sport/competition/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <SwitchComponent activePill="competition" />
            <Paper sx={{ padding: 2 }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography>Competitions</Typography>
                    <Button LinkComponent={Link} href="/sports/competitions/create" variant="contained" size="small">Add</Button>
                </Box>
                <Grid container alignItems="center">
                    {data.loading && <Loader minHeight={400} />}
                    {!data.loading && data.rows.map((item) => (
                        <>
                            <Grid item md={1} sm={0} >
                            </Grid>
                            <Grid item md={10} sm={12} key={item.id}>
                                <Paper sx={{ mt: 2 }}>
                                    <Carousel showThumbs={false} showStatus={false}>
                                        {item.banners.map((banner: string) => (
                                            <div key={banner}>
                                                <Avatar variant='square' alt={item.desc} sx={{ height: "200px", width: "100%" }} src={banner} />
                                            </div>
                                        ))}
                                    </Carousel>
                                    <Title variant="subtitle2" >
                                        <span></span>
                                        <span >What we are provide?</span>
                                        <IconButton onClick={() => onArchive(item)} size="small" sx={{ color: "error.light" }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Title>

                                    <Box sx={{ p: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
                                            {item?.provided && item.provided.map((facility: string) => (
                                                <Box key={facility}>
                                                    <Box sx={{ display: "flex", justifyContent: 'flex-start', alignItems: "center" }}>
                                                        <IconButton size='small' >
                                                            <CheckCircleOutlineIcon fontSize='small' />
                                                        </IconButton>
                                                        <Typography variant="body2" sx={{ wordWrap: "break-word", overflow: "hidden" }}>{facility}</Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box >
                                        <Typography variant='body2' sx={{ mt: 2, p: 1 }}>{item.desc}</Typography>
                                    </Box>
                                </Paper>
                            </Grid >
                            <Grid item md={1} sm={0} >
                            </Grid>
                        </>
                    ))}
                </Grid>
            </Paper >

            {AlertComponent}

        </>
    )
}