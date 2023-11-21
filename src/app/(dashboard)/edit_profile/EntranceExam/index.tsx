import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { FeesProps, InstituteClassProps, InstituteFacultiesProps, InstituteFeesProps, InstituteStreamProps, InstituteSubjectProps } from '@/types';
import MuiDataGrid from '@/components/MuiDataGrid';
import { GridColDef } from '@mui/x-data-grid';
import useConfirmation from '@/hooks/useConfirmation';
import AddEntranceExam from "./AddEntranceExam"


export default function FacultyAndStreamUpdate({ }) {
    const { showAlert, AlertComponent } = useConfirmation();

    const [feesList, setFeesList] = useState<InstituteFeesProps[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const getFeesListApi = () => {
        setIsLoading(true)
        axiosInstance.get("/api/institute/entrance_exam/list").then((res) => {
            setFeesList(res.data)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getFeesListApi();
    }, [])

    const columns: GridColDef[] = [
        {
            field: 'faculty',
            headerName: 'Faculty',
            flex: 1,
        },
        {
            field: 'entranceName',
            headerName: 'Exam',
            flex: 1,
        },
        {
            field: 'examLink',
            headerName: 'Exam Link',
            flex: 1,
            renderCell: ({ row }) => <IconButton color="primary" LinkComponent={'a'} target="_blank" href={row.examLink}><InsertLinkIcon /></IconButton>
        },
        {
            field: 'merit',
            headerName: 'Merit',
            flex: 1,
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            renderCell: ({ row }) => (<>
                <IconButton aria-label="delete" color="error" onClick={() => onArchive(row)} >
                    <DeleteOutlineIcon />
                </IconButton>
            </>
            ),
        },
    ];

    const onArchive = (row: FeesProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/entrance_exam/${row.id}`, { withCredentials: true }).then((res) => {
                        getFeesListApi();
                    })
                }
            }
        })
    }

    return (
        <div>

            <AddEntranceExam callApi={getFeesListApi} />

            <Box component="div" sx={{ mt: 2 }}>
                <Typography variant='h6' sx={{ color: "primary.main", mt: 3, mb: 1 }}>Added Entrance Exam</Typography>
                <MuiDataGrid
                    loading={isLoading}
                    rows={feesList}
                    columns={columns}
                    getRowHeight={() => 'auto'}
                    disableRowSelectionOnClick
                />
            </Box>

            {AlertComponent}
        </div >
    );
}