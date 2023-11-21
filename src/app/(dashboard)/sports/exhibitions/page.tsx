"use client"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { axiosInstance } from "@/utils/axiosInstance";
import { styled, Box, Button, IconButton, Paper, Typography, Grid, Avatar } from "@mui/material";
import Loader from '@/components/Loader';
import { useEffect, useState } from "react";
import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MuiPanel from "@/components/MuiPanel";
import DeleteIcon from '@mui/icons-material/Delete';
import YearPicker from '@/components/YearPicker';
import moment from 'moment';
import ExhibitionDetailsPopUp from "./ExhibitionDetailsPopUp";
import { ExhibitionProps } from '@/types';

const Wrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    gap: 4
}))

export default function Page() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [data, setData] = useState<{ loading: boolean, rows: ExhibitionProps[], year: any }>({
        loading: true,
        rows: [],
        year: moment()
    });
    const [openDetailsPopUp, setOpenDetailsPopUp] = useState<{ open: boolean, data: any }>({ open: false, data: {} })

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/sport/exhibition/list", {
            params: { year: moment(data.year).format("YYYY") }
        }).then((res) => {
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
                    axiosInstance.delete(`/api/sport/exhibition/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <SwitchComponent activePill="exhibition" />
            <Paper sx={{ padding: 2 }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography>Exhibitions</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <YearPicker
                            slotProps={{ textField: { size: 'small' } }}
                            label={''}
                            views={['year']}
                            value={data.year}
                            onChange={(e) => updateData("year", e)}
                            size="small"
                        />
                        <Button LinkComponent={Link} href="/sports/exhibitions/create" variant="contained" size="small">Add</Button>
                    </Box>
                </Box>
                <Grid container spacing={2}>
                    {data.loading && <Loader minHeight={400} />}
                    {!data.loading && data.rows.map((item) => (
                        <>
                            <Grid item md={6} sm={12} key={item.id} >
                                <Paper sx={{ display: "flex", alignItems: "center", border: "1px solid #E1E3E7", height: "100%" }}
                                    onClick={() => setOpenDetailsPopUp({ open: true, data: item })} >
                                    <Box sx={{ textAlign: "center", p: 1 }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center", mt: 1 }}>
                                            <Avatar src={item.avtarUrl} sx={{ height: 35, width: 35 }} />
                                            <Typography variant="subtitle2">{item.name || "Not Assign"}</Typography>
                                        </Box>
                                    </Box>
                                    <MuiPanel
                                        title={item.title}
                                        sx={{ mt: 0, borderLeft: "1px solid #E1E3E7", borderRadius: 0, width: "100%", height: "100%" }}
                                        elevation={0}
                                        onArchive={() => onArchive(item)}
                                    >
                                        <Typography
                                            sx={{ color: "text.secondary" }}
                                            variant="caption"
                                        >{item.desc}</Typography>
                                    </MuiPanel>
                                </Paper>
                            </Grid >
                        </>
                    ))}
                </Grid>
            </Paper >

            {AlertComponent}

            <ExhibitionDetailsPopUp
                open={openDetailsPopUp.open}
                handleClose={() => setOpenDetailsPopUp({ open: false, data: {} })}
                data={openDetailsPopUp.data}
            />
        </>
    )
}