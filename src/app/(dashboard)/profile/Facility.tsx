"use client"
import { Box, Grid, IconButton, MenuItem, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { FacilityProps } from "@/types";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import useConfirmation from "@/hooks/useConfirmation";

export default function Facility() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [facilities, setFacilities] = useState<{ loading: boolean, rows: FacilityProps[] }>({
        loading: true,
        rows: [],
    });

    const updateData = (k: string, v: any) => setFacilities((prev) => ({ ...prev, [k]: v }));

    const onArchive = (row: FacilityProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/facility/${row.id}`, { withCredentials: true }).then((res) => {
                        getFacilityListApi();
                    })
                }
            }
        })
    }

    const getFacilityListApi = () => {
        updateData("loading", true)
        axiosInstance.get("/api/institute/facility/list").then((res) => {
            updateData("rows", res.data)
            updateData("loading", false)
        })
    }

    useEffect(() => {
        getFacilityListApi()
    }, [])

    return (
        <>
            <Paper sx={{ p: 3, mt: 3 }}>
                {facilities.rows.map((item) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography>Facilities: {item.title}</Typography>
                            <IconButton size="small" color="error" onClick={() => onArchive(item)}><DeleteOutlineIcon fontSize="small" /> </IconButton>
                        </Box>
                        <Typography variant="subtitle2">{item.desc}</Typography>
                    </Box>
                ))}
            </Paper>

            {AlertComponent}
        </>
    )
}