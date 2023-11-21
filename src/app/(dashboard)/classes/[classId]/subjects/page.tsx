"use client"
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { GridColDef } from '@mui/x-data-grid';
import { axiosInstance } from '@/utils/axiosInstance';
import { IconButton, Grid, Typography, Button } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import MuiDataGrid from '@/components/MuiDataGrid';
import AddEditSubject from './AddEditSubject';
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Link from 'next/link';

export default function Page({ params }: { params: { classId: string } }) {
    const { showAlert, AlertComponent } = useConfirmation();
    const [editSubjectItem, setEditSubjectItem] = useState({})

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
            field: 'subjectName',
            headerName: 'Subject Name',
            flex: 1,
            minWidth: 250

        },
        {
            field: 'subjectShortName',
            headerName: 'Subject Short Name',
            flex: 1,

        },
        {
            field: 'assignTeacherName',
            headerName: 'Assign Teacher',
            flex: 1,
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            renderCell: ({ row }) => (<>
                <IconButton aria-label="edit"
                    onClick={() => setEditSubjectItem(row)}
                >
                    <BorderColorIcon />
                </IconButton>
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
        axiosInstance.get(`/api/institute/class/${params.classId}/subjects/list`).then((res) => {
            updateData("rows", res.data);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [])

    const cancelEdit = () => {
        setEditSubjectItem({})
    }

    return (
        <>
            <Grid container spacing={2} sx={{ mb: 1 }}>
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
                        Subjects
                    </Typography>
                </Grid>
            </Grid>
            <Box sx={{ height: "100%", width: '100%', background: "#fff", padding: 2 }} >
                <Box sx={{ marginBottom: 2, display: "flex", justifyContent: 'space-between' }}>
                    <AddEditSubject
                        classId={params.classId}
                        editSubjectItem={editSubjectItem}
                        callApi={callApi}
                        cancelEdit={cancelEdit}
                    />
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