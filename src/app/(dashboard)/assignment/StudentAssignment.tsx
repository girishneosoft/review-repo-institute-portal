"use client"
import MuiDataGrid from "@/components/MuiDataGrid";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, Box, Button, IconButton, Paper } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import Link from "next/link";
import moment from "moment";
import YearPicker from "@/components/YearPicker";

interface StudentAssignment {
    assignmentId: number;
}

export default function StudentAssignment({ assignmentId }: StudentAssignment) {
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
            headerName: 'Student',
            flex: 1,
            minWidth: 180,
            renderCell: ({ row }) => <>
                <Avatar alt="" src={row?.studentAvtarUrl} sx={{ marginRight: 2, width: 24, height: 24 }} />
                <Box >{row.studentName}</Box>
            </>
        },
        {
            field: 'obtainMarks',
            headerName: 'Obtain',
            flex: 1,
            minWidth: 150

        },
        {
            field: 'studentGivenDate',
            headerName: 'Given Date',
            flex: 1,
            minWidth: 150,
            renderCell: ({ value }) => moment(value).format("DD MMM YYYY")
        },
        {
            field: 'status',
            headerName: 'Action',
            flex: 1,
            minWidth: 150,
            renderCell: ({ row }) => <>
                {row.status === 1 ? <Button variant="contained" size="small">
                    Check
                </Button> : "Completed"}
            </>
        }
    ];

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/assignment/students", {
            params: { assignmentId: assignmentId }
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

    return (
        <>
            <Box sx={{ p: 2, pl: 4, pr: 4, background: "rgb(245 247 249)", border: "1px solid #E1E3E7" }}>
                <Paper elevation={0} >
                    <MuiDataGrid
                        density="compact"
                        loading={data.loading}
                        rows={data.rows}
                        columns={columns}
                        disableRowSelectionOnClick
                    />
                </Paper>
            </Box>
        </>
    )
}