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
import { useRouter } from 'next/navigation'

interface SubjectListProps {
    params: {
        userId: string
    }
}


export default function SubjectList({ params }: SubjectListProps) {
    const [data, setData] = useState({
        loading: true,
        rows: [],
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const columns: GridColDef[] = [
        {
            field: 'subjectName',
            headerName: 'Subjects',
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'attendancePercentage',
            headerName: 'Attendance',
            flex: 1,
            minWidth: 180,
            renderCell: ({ row }) => <>{row.attendancePercentage ?? "0"}%</>
        },
        {
            field: 'assignTeacher',
            headerName: 'Teachers',
            flex: 1,
            minWidth: 250

        }
    ];


    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get(`/api/student/${params.userId}/class/subjects`).then((res) => {
            updateData("rows", res.data);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [])

    return (
        <>
            <Box sx={{ height: "100%", width: '100%', }} >
                <MuiDataGrid
                    loading={data.loading}
                    rows={data.rows}
                    columns={columns}
                    pageSizeOptions={[5]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                />
            </Box>

        </>
    );
}