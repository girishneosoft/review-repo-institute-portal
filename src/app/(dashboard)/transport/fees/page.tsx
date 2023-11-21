"use client"
import MuiDataGrid from "@/components/MuiDataGrid";
import { axiosInstance } from "@/utils/axiosInstance";
import { Button, Box, IconButton, Paper, Typography } from "@mui/material";
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
            field: 'fromLocation',
            headerName: 'Route',
            width: 180,
            renderCell: ({ row }) => <>{`${row.fromLocation} to ${row.toLocation}`}</>
        },
        {
            field: 'fees',
            headerName: 'Amount',
            width: 100
        },
        {
            field: 'desc',
            headerName: 'Description',
            flex: 1,
            minWidth: 180

        },
        {
            field: 'Action',
            headerName: 'Action',
            width: 100,
            renderCell: ({ row }) => <>
                <IconButton color="error" onClick={() => onArchive(row)} aria-label="delete" size="small">
                    <DeleteIcon fontSize="inherit" />
                </IconButton>

            </>
        }
    ];

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/transport_fees/list").then((res) => {
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
                    axiosInstance.delete(`/api/transport_fees/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };


    return (
        <>
            <SwitchComponent activePill="fees" />
            <Paper sx={{ padding: 2 }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography>Fees Details</Typography>
                    <Button LinkComponent={Link} href="/transport/fees/create" variant="contained" size="small">Add Fees</Button>
                </Box>
                <MuiDataGrid
                    density="compact"
                    loading={data.loading}
                    rows={data.rows}
                    columns={columns}
                    getRowHeight={() => 'auto'}
                    disableRowSelectionOnClick
                />
            </Paper>

            {AlertComponent}
        </>
    )
}