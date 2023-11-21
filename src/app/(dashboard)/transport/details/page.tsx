"use client"
import { axiosInstance } from "@/utils/axiosInstance";
import { Typography, Box, styled, Paper, IconButton, Button } from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";

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
        axiosInstance.get("/api/transport_details/list").then((res) => {
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
                    axiosInstance.delete(`/api/transport_details/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };


    return (
        <>
            <SwitchComponent activePill="details" />

            <Paper sx={{ p: 2, height: "100%" }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 600 }}>Transport details/ Information</Typography>
                    <Button LinkComponent={Link} href="/transport/details/create" variant="contained" size="small">Add Fees</Button>
                </Box>
                {data.rows.map((item) => (
                    <Paper key={item.id} sx={{ mt: 2 }}>
                        <Title variant="subtitle2" >
                            <span >{item.title}</span>
                            <IconButton onClick={() => onArchive(item)} size="small" sx={{ color: "error.light" }}>
                                <DeleteIcon />
                            </IconButton>
                        </Title>
                        <Box sx={{ p: 1 }}>
                            <Typography variant="body2" > {item.desc}</Typography>
                        </Box>
                    </Paper>
                ))}
            </Paper>

            {AlertComponent}
        </>
    )
}