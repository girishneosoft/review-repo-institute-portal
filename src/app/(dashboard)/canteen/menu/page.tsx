"use client"

import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, styled, Box, Button, Grid, Paper, Typography, MenuItemProps } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";
import { CanteenItemProps } from "@/types";
import Loader from "@/components/Loader";

const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "5px 7px",
    color: theme.palette.primary.main,
    borderTopRightRadius: "10px",
    borderTopLeftRadius: "10px"
}))

export default function Page() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [data, setData] = useState<{ loading: boolean, rows: CanteenItemProps[] }>({
        loading: true,
        rows: []
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/canteen/menu/list").then((res) => {
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
                    axiosInstance.delete(`/api/canteen/menu/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <SwitchComponent activePill="menu" />
            <Paper sx={{ padding: 2, height: "100%" }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600 }}>Menu card and products</Typography>
                    <Button LinkComponent={Link} href="/canteen/menu/create" variant="contained" size="small">Add Menu</Button>
                </Box>

                {data.loading && <Loader minHeight={250} />}

                {!data.loading && <Grid container spacing={2} sx={{}}>
                    <Grid item md={6} sm={12}>
                        <Paper sx={{ mt: 2, height: "100%", borderRadius: "10px" }}>
                            <Title variant="subtitle1" >
                                Snacks
                            </Title>
                            <Box sx={{ p: 1 }}>
                                {data.rows.filter((r) => r.itemType === 1).map((item) => (
                                    <MenuItem key={item.id} item={item} onArchive={onArchive} />
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item md={6} sm={12}>
                        <Paper sx={{ mt: 2, height: "100%", borderRadius: "10px" }}>
                            <Title variant="subtitle1" >
                                Meal
                            </Title>
                            <Box sx={{ p: 1 }}>
                                {data.rows.filter((r) => r.itemType === 2).map((item) => (
                                    <MenuItem key={item.id} item={item} onArchive={onArchive} />
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>}
            </Paper>

            {AlertComponent}

        </>
    )
}

const MenuItem = ({ item, onArchive }: { item: CanteenItemProps, onArchive: any }) => {
    return (
        <>
            <Paper sx={{ mt: 1, border: "1px solid #E1E3E7", borderBottom: 0, borderRadius: "10px" }}>
                <Grid container >
                    <Grid item xs={2}>
                        <Avatar src={item.itemAvtarUrl} variant="square" sx={{ height: 60, width: 60, borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", border: "1px solid #E1E3E7" }} />
                    </Grid>
                    <Grid item xs={8} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <Typography>{item.itemName}</Typography>
                    </Grid>
                    <Grid item xs={2} >
                        <Paper sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                            <Typography>₹{item.price}</Typography>
                            <Box
                                onClick={() => onArchive(item)}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    border: "1px solid #E1E3E7",
                                    color: "error.light",
                                    cursor: "pointer"
                                }}><DeleteIcon sx={{ fontSize: "18px" }}></DeleteIcon></Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper >
        </>
    )
}