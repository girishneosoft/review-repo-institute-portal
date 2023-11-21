"use client"
import MuiDataGrid from "@/components/MuiDataGrid";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, Box, Button, IconButton, Paper } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import SwitchComponent from "../SwitchComponent";
import Link from "next/link";
import moment from "moment";
import YearPicker from "@/components/YearPicker";

export default function Page() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [data, setData] = useState({
        year: moment(),
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
            field: 'amount',
            headerName: 'Amount',
            flex: 1,
            minWidth: 100

        },
        {
            field: 'mobile',
            headerName: 'Mobile Number',
            flex: 1,
            minWidth: 130

        },
        {
            field: 'sponserFor',
            headerName: 'Sponsor For',
            flex: 1,
            minWidth: 180

        },
        {
            field: 'desc',
            headerName: 'Description',
            flex: 1,
            minWidth: 280

        },
        {
            field: 'Action',
            headerName: 'Action',
            flex: 1,
            minWidth: 80,
            renderCell: ({ row }) => <>
                <IconButton color="error" onClick={() => onArchive(row)} aria-label="delete" size="small">
                    <DeleteIcon fontSize="inherit" />
                </IconButton>

            </>
        }
    ];

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/culture/sponser/list", {
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
                    axiosInstance.delete(`/api/culture/sponser/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };
    console.log(data, "data")
    return (
        <>
            <SwitchComponent activePill="sponsor" />
            <Paper sx={{ padding: 2 }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <YearPicker
                        slotProps={{ textField: { size: 'small' } }}
                        label={''}
                        views={['year']}
                        value={data.year}
                        onChange={(e) => updateData("year", e)}
                        size="small"
                    />
                    <Button LinkComponent={Link} href="/culture/sponsors/create" variant="contained" size="small">Add</Button>
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