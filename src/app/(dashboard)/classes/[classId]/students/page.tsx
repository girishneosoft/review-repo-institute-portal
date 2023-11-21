"use client"
import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { axiosInstance } from '@/utils/axiosInstance';
import { IconButton } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import MuiDataGrid from '@/components/MuiDataGrid';
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Link from 'next/link';

export default function Page({ params }: { params: { classId: string } }) {
    const { showAlert, AlertComponent } = useConfirmation();

    const onArchive = (row: any) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/class/subject/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    const columns: GridColDef[] = [
        {
            field: 'rollNumber',
            headerName: 'Roll. No',
            flex: 1,
            minWidth: 180

        },
        {
            field: 'name',
            headerName: 'Student name',
            flex: 1,
        },
        {
            field: 'attendancePercentage',
            headerName: 'Attendance',
            flex: 1,
        },
        {
            field: 'statusString',
            headerName: 'Status',
            flex: 1,
            minWidth: 100,
            renderCell: ({ value, row }) => <Box
                sx={{ color: row.status === 1 ? "success.main" : "error.main" }}
            >{value}</Box>
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            renderCell: ({ row }) => (<>
                <IconButton aria-label="delete" onClick={() => onArchive(row)}>
                    <DeleteIcon />
                </IconButton>
            </>
            ),
        }
    ];

    const [data, setData] = useState({
        loading: true,
        rows: [],
        pageSize: 10
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get(`/api/institute/class/${params.classId}/students`).then((res) => {
            updateData("rows", res.data);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [])

    return (
        <>
            <Grid container spacing={2} sx={{ pt: 1, pb: 1 }}>
                <Grid item sm={4}>
                    <Button
                        component={Link}
                        href="/classes"
                        startIcon={<ArrowBackIosNewOutlinedIcon />}
                        size="small" variant='outlined'
                    >Back</Button>
                </Grid>
                <Grid item sm={4}>
                    <Typography color={"primary"} variant="subtitle2" sx={{ textAlign: "center" }}>
                        Students
                    </Typography>
                </Grid>
            </Grid>
            <Box sx={{ height: "100%", width: '100%', background: "#fff", padding: 2 }} >
                <Box sx={{ marginBottom: 2, display: "flex", justifyContent: 'space-between' }}>
                    {/* <AddSubject classId={params.classId} callApi={callApi} /> */}
                </Box>
                <MuiDataGrid
                    loading={data.loading}
                    rows={data.rows}
                    columns={columns}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                />
            </Box>

            {AlertComponent}
        </>
    )
} 