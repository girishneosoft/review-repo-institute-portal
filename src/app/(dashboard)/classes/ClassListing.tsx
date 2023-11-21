"use client"
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { axiosInstance } from '@/utils/axiosInstance';
import { Button, MenuItem, FormControl, IconButton } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import MuiDataGrid from '@/components/MuiDataGrid';
import SelectDropdown from '@/components/SelectDropdown';
import useConfirmation from '@/hooks/useConfirmation';
import Link from 'next/link';
import CreateClass from "./CreateClass";
import DeleteIcon from '@mui/icons-material/Delete';
import ClassFilter from './ClassFilter';
import AssignClassTeacherPopUp from './[classId]/AssignClassTeacherPopUp';

interface ClassListingProps {
    faculties: { facultyId: number, name: string }[]
}

export default function ClassListing({ faculties }: ClassListingProps) {
    const { showAlert, AlertComponent } = useConfirmation();
    const [open, setOpen] = useState(false);
    const [openAssignTeacher, setOpenAssignTeacher] = useState({ open: false, classId: null, classTeacherId: null, classTeacher: null });

    const columns: GridColDef[] = [
        {
            field: 'stream',
            headerName: 'Branch',
            flex: 1,
            minWidth: 250

        },
        {
            field: 'className',
            headerName: 'Class',
            flex: 1,

        },
        {
            field: 'division',
            headerName: 'Division',
            flex: 1,
        },
        {
            field: 'student',
            headerName: 'Students',
            flex: 1,
            renderCell: ({ row }) => <IconButton
                component={Link}
                href={`classes/${row.id}/students`}
                aria-label="students">
                <RemoveRedEyeIcon />
            </IconButton>
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            renderCell: ({ row }) => (<>
                <IconButton aria-label="delete" onClick={() => onArchive(row)} >
                    <DeleteIcon />
                </IconButton>
            </>
            ),
        },
        {
            field: 'subject',
            headerName: 'Subjects',
            flex: 1,
            renderCell: ({ row }) => (<>
                <Button
                    component={Link}
                    href={`classes/${row.id}/subjects`}
                    size="small"
                    variant={"contained"}
                >
                    Manage
                </Button>
            </>
            ),
        },
        {
            field: 'classTeacher',
            headerName: 'Class Teacher',
            flex: 1,
            renderCell: ({ row }) => (<>
                <Button
                    size="small"
                    variant={"contained"}
                    onClick={() => setOpenAssignTeacher({ open: true, classId: row.id, classTeacherId: row.classTeacherId, classTeacher: row.classTeacher })}
                >
                    Assign
                </Button>
            </>
            ),
        },
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
        pageSize: 10,
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
                <Box sx={{ marginBottom: 2, display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                    <SelectDropdown
                        sx={{ maxWidth: 250 }}
                        value={data?.filter?.instituteFacultyId}
                        size="small"
                        onChange={(e: any) => updateData("filter", { ...data.filter, instituteFacultyId: e.target.value })}
                        clearable={true}
                        onClearInput={() => updateData("filter", { ...data.filter, instituteFacultyId: "" })}
                        displayEmpty
                        renderValue={(selected: any) => {
                            if (selected.length === 0) {
                                return "Select Department";
                            } else {
                                return faculties.find((f) => f.facultyId === selected)?.name;
                            }
                        }}
                    >
                        {faculties.map((row) => <MenuItem key={row?.facultyId} value={row?.facultyId}>{row.name}</MenuItem>)}
                    </SelectDropdown>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <ClassFilter
                            filterOption={data?.filter}
                            setFilterOption={(value: any) => updateData("filter", value)}
                        />
                        <Button size="small" variant={"contained"}
                            onClick={() => setOpen(true)}
                        >Add</Button>
                    </Box>
                </Box>
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
                />
            </Box>

            <CreateClass
                open={open}
                handleClose={handleCloseModel}
            />

            {openAssignTeacher.open && <AssignClassTeacherPopUp
                open={openAssignTeacher?.open}
                classId={openAssignTeacher?.classId}
                classTeacherId={{ id: openAssignTeacher?.classTeacherId, name: openAssignTeacher?.classTeacher }}
                handleClose={handleCloseModel}
            />}

            {AlertComponent}
        </>
    )
} 