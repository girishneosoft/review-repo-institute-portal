"use client"
import MuiCalendar from "@/components/MuiCalendar";
import MuiPanel from "@/components/MuiPanel";
import { CultureProps } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { Paper, Grid, Button, styled, Typography, IconButton, Box } from "@mui/material";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import useConfirmation from '@/hooks/useConfirmation';
import moment from "moment";
import SwitchComponent from "../SwitchComponent";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

const Wrapper = styled(Box)(({ theme }) => ({
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
    const [cultures, setCultures] = useState<CultureProps[]>([]);

    const callApi = () => {
        axiosInstance("/api/culture/list").then((res) => {
            setCultures(res.data)
        })
    }

    useEffect(() => {
        callApi()
    }, [])

    const events = useMemo(() => {
        return cultures.map((item) => {
            return {
                id: item.id,
                title: item.title,
                start: moment(item.cultureDate),
                end: moment(item.cultureDate)
            }
        })
    }, [cultures])

    const onArchive = (row: any) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/culture/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <SwitchComponent activePill="calendar" />
            <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item md={9} sm={9}>
                        <MuiCalendar
                            sx={{ height: "280px" }}
                            events={events}
                        />
                    </Grid>
                    <Grid item md={3} sm={3} sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignSelf: "baseline"
                    }}>
                        <Button
                            LinkComponent={Link}
                            href="/culture/calendar/create"
                            variant="contained"
                            size="small"
                        >Add Calendar</Button>
                    </Grid>
                    <Grid item xs={12}>
                        {cultures.map((item) => (
                            <Paper key={item.id} sx={{ mt: 2 }} elevation={1}>
                                <Wrapper >
                                    <Typography variant="subtitle2">{item.title}</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 2 }}>
                                        <Typography variant="subtitle2">{moment(item.cultureDate).format("DD MMM YYYY")}</Typography>
                                        <IconButton onClick={() => onArchive(item)} size="small" sx={{ color: "error.light" }}>
                                            <DeleteForeverOutlinedIcon />
                                        </IconButton>
                                    </Box>
                                </Wrapper>
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="body2" >{item.desc}</Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Grid>


                </Grid>

            </Paper >
            {AlertComponent}
        </>
    )
}