"use client"
import MuiDataGrid from "@/components/MuiDataGrid";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";

export default function Page() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [data, setData] = useState({
        loading: true,
        rows: []
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 180,
            renderCell: ({ row }) => <>
                <Avatar alt="" src={row?.avtarUrl} sx={{ marginRight: 2, width: 24, height: 24 }} />
                <Box >{row.name}</Box>
            </>
        },
        {
            field: 'position',
            headerName: 'Designation',
            flex: 1,
            minWidth: 180

        },
        {
            field: 'mobile',
            headerName: 'Mobile Number',
            flex: 1,
            minWidth: 180

        },
        {
            field: 'Action',
            headerName: 'Action',
            flex: 1,
            minWidth: 180,
            renderCell: ({ row }) => <>
                <IconButton color="error" onClick={() => onArchive(row)} aria-label="delete" size="small">
                    <DeleteIcon fontSize="inherit" />
                </IconButton>

            </>
        }
    ];

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/transport_team/list").then((res) => {
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
                    axiosInstance.delete(`/api/transport_team/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <SwitchComponent activePill="member" />
            <Paper sx={{ padding: 2, height: "100%" }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography>Team members</Typography>
                    <Button LinkComponent={Link} href="/transport/team-members/create" variant="contained" size="small">Add Member</Button>
                </Box>
                <MuiDataGrid
                    density="compact"
                    loading={data.loading}
                    rows={data.rows}
                    columns={columns}
                    disableRowSelectionOnClick
                />
            </Paper>

            {AlertComponent}

        </>
    )
}