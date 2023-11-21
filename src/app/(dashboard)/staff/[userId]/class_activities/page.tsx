"use client"
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridEventListener, GridValueGetterParams } from '@mui/x-data-grid';
import { axiosInstance } from '@/utils/axiosInstance';
import { Avatar, Button, Chip, IconButton, Switch } from '@mui/material';
import SearchInput from '@/components/SearchInput';
import useConfirmation from '@/hooks/useConfirmation';
import CustomButton from '@/components/CustomButton';
import MuiDataGrid from '@/components/MuiDataGrid';
import DeleteIcon from '@mui/icons-material/Delete';


import SwitchProfileActivity from '../SwitchProfileActivity';
import { Paper, Typography } from '@mui/material';
import moment from 'moment';


interface LayoutProps {
    params: {
        userId: string
    }
}

export default function Page({ params }: LayoutProps) {
    const [data, setData] = useState({
        loading: true,
        rows: [],
    });
    const { showAlert, AlertComponent } = useConfirmation();
    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const columns: GridColDef[] = [
        {
            field: 'faculty',
            headerName: 'Faculty',
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'stream',
            headerName: 'Stream',
            flex: 1,
            minWidth: 180

        },
        {
            field: 'className',
            headerName: 'Class',
            flex: 1,
            minWidth: 180

        },
        {
            field: 'subjectName',
            headerName: 'Subject',
            flex: 1,
            minWidth: 180
        },
        {
            field: 'updatedAt',
            headerName: 'Assign Date',
            flex: 1,
            minWidth: 180,
            renderCell: ({ row }) => moment(row.updatedAt).format("DD MMM YYYY")
        },
        {
            field: 'Action',
            headerName: 'Action',
            flex: 1,
            minWidth: 180,
            renderCell: ({ row }) => <IconButton color="error" onClick={() => onReleaseTeacher(row)}><DeleteIcon /></IconButton>
        }
    ];


    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get(`/api/teacher/${params.userId}/assign_class`).then((res) => {
            updateData("rows", res.data);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [])

    const onReleaseTeacher = (row: any) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.post(`/api/institute/class/subject/${row.id}/assign_teacher`, {
                        teacherId: "",
                    }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <SwitchProfileActivity
                hrefPrimary={`/staff/${params.userId}/profile`}
                hrefSecondary={`/staff/${params.userId}/class_activities`}
                activePrimary={false}
                activeSecondary={true}
            />

            <Paper elevation={0} sx={{ p: 2 }}>
                <Typography sx={{ mb: 2 }}>Assigned Classes</Typography>
                <MuiDataGrid
                    loading={data.loading}
                    rows={data.rows}
                    columns={columns}
                    pageSizeOptions={[5]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                />
            </Paper>

            {AlertComponent}
        </>
    )
}