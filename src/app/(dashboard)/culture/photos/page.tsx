"use client"
import YearPicker from "@/components/YearPicker";
import { axiosInstance } from "@/utils/axiosInstance";
import { styled, Box, Button, IconButton, Paper, Typography, Grid, Avatar } from "@mui/material";

import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";
import moment from "moment";
import UploadImage from "./UploadPhotoPopUp";

export default function Page() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [data, setData] = useState<{ year: any, loading: boolean, rows: any[] }>({
        year: moment(),
        loading: true,
        rows: []
    });
    const [openUploadPhoto, setOpenUploadPhoto] = useState(false)

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/culture_photo/list", {
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
                    axiosInstance.delete(`/api/culture_photo/${row.id}`).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <SwitchComponent activePill="photo" />
            <Paper sx={{ padding: 2, height: "100%" }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography>Photos</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <YearPicker
                            slotProps={{ textField: { size: 'small' } }}
                            label={''}
                            views={['year']}
                            value={data.year}
                            onChange={(e) => updateData("year", e)}
                            size="small"
                        />
                        <Button onClick={() => setOpenUploadPhoto(true)} variant="contained" size="small">Add Photos</Button>
                    </Box>
                </Box>
                <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-start", gap: 2, flexFlow: "row wrap" }}>
                    {data.rows.map((item) => (
                        <Box key={item.id}>
                            <Box sx={{ position: "relative", }}>
                                <Avatar
                                    variant="square"
                                    src={item.picUrl}
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
                                    onClick={() => onArchive(item)}
                                >
                                    <DeleteIcon />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Paper>

            {AlertComponent}

            {openUploadPhoto && <UploadImage
                open={openUploadPhoto}
                handleClose={() => {
                    setOpenUploadPhoto(false)
                    callApi();
                }}
            />}
        </>
    )
}