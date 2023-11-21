"use client"
import SelectDropdown from "@/components/SelectDropdown";
import { Box, Grid, IconButton, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { EntranceExamsProps, InstituteFacultiesProps, InstituteStreamProps } from "@/types";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import MuiDataGrid from "@/components/MuiDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import useConfirmation from "@/hooks/useConfirmation";

export default function EntranceExam() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [facultyId, setFacultyId] = useState(0);

    const [entranceExams, setEntranceExams] = useState<{ loading: boolean, rows: EntranceExamsProps[] }>({
        loading: true,
        rows: [],
    });

    const updateData = (k: string, v: any) => setEntranceExams((prev) => ({ ...prev, [k]: v }));

    const columns: GridColDef[] = [
        {
            field: 'entranceName',
            headerName: 'Exam',
            flex: 1,
        },
        {
            field: 'examLink',
            headerName: 'Link',
            minWidth: 280,
            flex: 1,
            renderCell: ({ row }) => <IconButton color="primary" LinkComponent={'a'} target="_blank" href={row.examLink}><InsertLinkIcon /></IconButton>
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

    const onArchive = (row: EntranceExamsProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/entrance_exam/${row.id}`, { withCredentials: true }).then((res) => {
                        getEntranceExamApi();
                    })
                }
            }
        })
    }

    const getEntranceExamApi = () => {
        axiosInstance.get("/api/institute/entrance_exam/list").then((res) => {
            updateData("rows", res.data)
            updateData("loading", false)
        })
    }

    useEffect(() => {
        updateData("loading", true)
        axiosInstance.get("/api/institute/faculties").then((res) => {
            setFaculties(res.data)
            console.log(res.data[0]?.facultyId, "res.data.length")
            if (res.data.length > 0) {
                setFacultyId(res.data[0]?.facultyId)
            }

        })
        getEntranceExamApi()
    }, [])

    return (
        <>
            <Grid container sx={{ mt: 3 }}>
                <Grid item md={3} sm={12}>
                    <Box>
                        <SelectDropdown
                            label="Select Faculty"
                            size="small"
                            onChange={(e: any) => setFacultyId(e.target.value)}
                            value={facultyId}
                        >
                            {faculties.map((item) => (
                                <MenuItem key={item.facultyId} value={item.facultyId}>{item.name}</MenuItem>
                            ))}
                        </SelectDropdown>
                    </Box>
                </Grid>
                <Grid item md={3} sm={12}>
                </Grid>
                <Grid item md={6} sm={12}>
                    <MuiDataGrid
                        loading={entranceExams.loading}
                        rows={entranceExams.rows.filter((item) => item.instituteFacultyId === facultyId)}
                        columns={columns}
                        disableRowSelectionOnClick
                    />
                </Grid>
            </Grid>

            {AlertComponent}
        </>
    )
}