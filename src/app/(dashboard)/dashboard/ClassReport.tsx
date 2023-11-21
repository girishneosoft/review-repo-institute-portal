"use client"
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { axiosInstance } from '@/utils/axiosInstance';
import { Button, MenuItem, Typography, IconButton } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import MuiDataGrid from '@/components/MuiDataGrid';
import SelectDropdown from '@/components/SelectDropdown';
import useConfirmation from '@/hooks/useConfirmation';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';

interface ClassListingProps {
    faculties: { facultyId: number, name: string }[]
}

export default function ClassReport() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [open, setOpen] = useState(false);
    const [openAssignTeacher, setOpenAssignTeacher] = useState({ open: false, classId: null, classTeacherId: null, classTeacher: null });

    const columns: GridColDef[] = [
        {
            field: 'className',
            headerName: 'Class',
            flex: 1,

        },
        {
            field: 'stream',
            headerName: 'Branch',
            flex: 1,
            minWidth: 250

        },
        {
            field: 'faculty',
            headerName: 'Department',
            flex: 1,
        },
        // {
        //     field: 'action',
        //     headerName: 'Action',
        //     flex: 1,
        //     sortable: false,
        //     renderCell: ({ row }) => (<>
        //         <IconButton aria-label="delete" onClick={() => onArchive(row)} >
        //             <DeleteIcon />
        //         </IconButton>
        //     </>
        //     ),
        // }
    ];

    const [data, setData] = useState({
        filter: {
            instituteFacultyId: "",
            instituteStreamId: "",
        },
        facultyId: null,
        loading: true,
        rows: [],
        count: 0,
        rowsPerPageOptions: [5, 10, 15],
        pageSize: 3,
        page: 0
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.post("/api/institute/class/list", {
            offset: data.page,
            limit: data.pageSize,
            filter: data.filter,
        }).then((res) => {
            updateData("count", res.data.count);
            updateData("rows", res.data.rows);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [data.pageSize, data.page, data.filter])

    const handleCloseModel = (status: boolean) => {
        setOpen(false)
        setOpenAssignTeacher({ open: false, classId: null, classTeacherId: null, classTeacher: null })
        if (status) {
            callApi()
        }
    }

    const onArchive = (row: any) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/class/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <Box sx={{ height: "100%", width: '100%', background: "#fff", padding: 2 }} >
                <Typography sx={{ mb: 1 }}>Class Attendance</Typography>
                <MuiDataGrid
                    pagination
                    paginationMode="server"
                    loading={data.loading}
                    rowCount={data.count}
                    paginationModel={{ pageSize: data.pageSize, page: data.page }}
                    onPaginationModelChange={(e) => {
                        updateData("page", e.page)
                        updateData("pageSize", e.pageSize)
                    }}
                    rows={data.rows}
                    columns={columns}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    density='compact'
                />
            </Box>
        </>
    )
} 