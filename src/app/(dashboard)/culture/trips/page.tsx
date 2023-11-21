"use client"
import MuiDataGrid from "@/components/MuiDataGrid";
import { axiosInstance } from "@/utils/axiosInstance";
import { styled, Box, Button, IconButton, Paper, Typography, Grid, Avatar, ListItem } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";
import YearPicker from "@/components/YearPicker";
import moment from "moment";
import MuiPanel from "@/components/MuiPanel";

const Wrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    gap: 4,
    padding: 2,
}))

const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "3px 7px",
    color: theme.palette.primary.main
}))

export default function Page() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [data, setData] = useState<{ year: any, loading: boolean, rows: any[] }>({
        year: moment(),
        loading: true,
        rows: []
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/institute_trip/list", {
            params: { year: moment(data?.year).format("YYYY") }
        }).then((res) => {
            updateData("rows", res.data);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [data.year])

    const onArchive = (row: any) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute_trip/${row.id}`).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    const onArchivePhoto = (itemPhoto: any) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute_trip/photo/${itemPhoto.id}`)
                        .then((res) => {
                            callApi();
                        })
                }
            }
        })
    };

    return (
        <>
            <SwitchComponent activePill="trip" />
            <Paper sx={{ padding: 2 }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Typography>Trips</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <YearPicker
                            slotProps={{ textField: { size: 'small' } }}
                            label={''}
                            views={['year']}
                            value={data.year}
                            onChange={(e) => updateData("year", e)}
                            size="small"
                        />
                        <Button LinkComponent={Link} href="/culture/trips/create" variant="contained" size="small">Add Trip</Button>
                    </Box>
                </Box>
                <Grid container alignItems="center" rowSpacing={2}>
                    {data.rows.map((item) => (
                        <>
                            <Grid item md={2} sm={0} >
                            </Grid>
                            <Grid item md={8} sm={12} key={item.id}>
                                <Title variant="subtitle2"  >
                                    <span></span>
                                    <span >{item?.title}</span>
                                    <IconButton onClick={() => onArchive(item)} size="small" sx={{ color: "error.light" }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Title>
                                <Paper sx={{ p: 1 }}>
                                    <Wrapper>
                                        <Typography variant="body2" sx={{ color: "#000" }}>Date</Typography>
                                        <Typography variant="body2" color="text.secondary" >{moment(item.tripDate).format("DD MMM YYYY")}</Typography>
                                    </Wrapper>
                                    <Wrapper>
                                        <Typography variant="body2" sx={{ color: "#000" }}>Managed by</Typography>
                                        <Typography variant="body2" color="text.secondary" >{item.managedBy}</Typography>
                                    </Wrapper>
                                    <Wrapper>
                                        <Typography variant="body2" sx={{ color: "#000" }}>Total students</Typography>
                                        <Typography variant="body2" color="text.secondary" >{item.totalStudent}</Typography>
                                    </Wrapper>
                                    <Wrapper>
                                        <Typography variant="body2" sx={{ color: "#000" }}>Trip details:</Typography>
                                    </Wrapper>

                                    <Typography variant="body2" color="text.secondary">{item.tripDetails}</Typography>

                                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start", gap: 2, flexFlow: "row wrap" }}>
                                        {item.trip_photos.map((photo: any) => (
                                            <Box key={photo.id}>
                                                <Box sx={{ position: "relative" }}>
                                                    <Avatar
                                                        variant="square"
                                                        src={photo.picUrl}
                                                        sx={{ height: 100, width: 100, borderRadius: "9px" }}
                                                    />
                                                    <Box sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 0,
                                                        color: "error.light",
                                                        background: "#fff",
                                                        borderRadius: "4px",
                                                        cursor: "pointer"
                                                    }}
                                                        onClick={() => onArchivePhoto(photo)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid >
                            <Grid item md={2} sm={0} >
                            </Grid>
                        </>
                    ))}
                </Grid>
            </Paper >

            {AlertComponent}

        </>
    )
}