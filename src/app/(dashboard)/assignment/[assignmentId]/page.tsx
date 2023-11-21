"use client"
import MuiDataGrid from "@/components/MuiDataGrid";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import Link from "next/link";
import moment from "moment";
import YearPicker from "@/components/YearPicker";
import CustomButton from "@/components/CustomButton";
import SearchInput from "@/components/SearchInput";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

interface StudentAssignment {
    params: {
        assignmentId: number
    };
}

export default function StudentAssignment({ params }: StudentAssignment) {
    const { showAlert, AlertComponent } = useConfirmation();
    const [search, setSearch] = useState("");
    const [data, setData] = useState<{ loading: boolean, rows: any[] }>({
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
                <Avatar alt="" src={row?.studentAvtarUrl} sx={{ marginRight: 2, width: 30, height: 30 }} />
                <Box >{row.studentName}</Box>
            </>
        },
        {
            field: 'studentGivenDate',
            headerName: 'Date',
            flex: 1,
            minWidth: 150,
            renderCell: ({ value }) => moment(value).format("DD MMM YYYY")
        },
        {
            field: 'totalQuestion',
            headerName: 'Question',
            flex: 1,
            minWidth: 150

        },
        {
            field: 'solvedQuestion',
            headerName: 'Solved',
            flex: 1,
            minWidth: 150
        },
        {
            field: 'obtainMarks',
            headerName: 'Obtain Marks',
            flex: 1,
            minWidth: 150
        },
        {
            field: 'status',
            headerName: 'Action',
            flex: 1,
            minWidth: 150,
            renderCell: ({ row }) => <>
                {row.status === 1 ? <Button
                    variant="contained"
                    size="small"
                    LinkComponent={Link}
                    href={`/assignment/${row.id}/check_assignment`}
                >
                    Check
                </Button> : "Completed"}
            </>
        }
    ];

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.get("/api/assignment/students", {
            params: { assignmentId: params.assignmentId }
        }).then((res) => {
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
                    axiosInstance.delete(`/api/culture/sponser/${row.id}`, { withCredentials: true }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'space-between', mb: 2 }}>
                <Button
                    LinkComponent={Link}
                    href="/assignment"
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowBackIosNewOutlinedIcon fontSize="small" />}
                >Back</Button>
                <Typography color="primary.main">{data?.rows.length && data?.rows[0].subjectName}</Typography>
                <Box sx={{ display: "flex", justifyContent: 'flex-start', gap: 2, alignItems: "center" }}>
                    <SearchInput
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(ev: any) => {
                            if (ev.key === 'Enter') {
                                ev.preventDefault();
                                updateData("search", search)
                            }
                        }}
                        value={search}
                    />
                </Box>
            </Box>
            <Paper elevation={0} >
                <MuiDataGrid
                    // density="compact"
                    loading={data.loading}
                    rows={data.rows}
                    columns={columns}
                    disableRowSelectionOnClick
                />
            </Paper>

        </>
    )
}