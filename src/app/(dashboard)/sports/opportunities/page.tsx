"use client"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { axiosInstance } from "@/utils/axiosInstance";
import { styled, Box, Button, IconButton, Paper, Typography, Grid, Avatar, CardHeader } from "@mui/material";

import { useEffect, useState } from "react";
import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import DeleteIcon from '@mui/icons-material/Delete';

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
        axiosInstance.get("/api/sport/opportunities/list").then((res) => {
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
                    axiosInstance.delete(`/api/sport/opportunities/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <SwitchComponent activePill="opportunities" />
            <Paper sx={{ padding: 2 }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography>Opportunities</Typography>
                    <Button LinkComponent={Link} href="/sports/opportunities/create" variant="contained" size="small">Add</Button>
                </Box>
                <Grid container alignItems="center">
                    {data.rows.map((item) => (
                        <>
                            <Grid item md={1} sm={0} >
                            </Grid>
                            <Grid item md={10} sm={12} key={item.id}>
                                <Paper sx={{ mt: 2 }}>
                                    <Title variant="subtitle2" >
                                        <span></span>
                                        <span >Opportunities</span>
                                        <IconButton onClick={() => onArchive(item)} size="small" sx={{ color: "error.light" }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Title>

                                    <Box sx={{ p: 2 }}>

                                        <Typography variant='body2' >{item.desc}</Typography>

                                        <Typography variant='subtitle1' sx={{ mt: 2 }}>Our selected candidate</Typography>
                                        <Grid container columnSpacing={3}>
                                            {item?.candidates && item.candidates.map((item: any) => (
                                                <Grid item xs={12} sm={6} md={4} key={item}>
                                                    <Paper sx={{ alignItems: "center" }}>
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar src={item?.avtarUrl} aria-label={item.name} />
                                                            }
                                                            action={
                                                                <IconButton onClick={() => { }}
                                                                    color="error" size='small' sx={{ background: "#F0F3FF", mt: 1 }}>
                                                                    <DeleteIcon fontSize='small' />
                                                                </IconButton>
                                                            }
                                                            title={item.name}
                                                            subheader={item?.userName}
                                                        />
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid >
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