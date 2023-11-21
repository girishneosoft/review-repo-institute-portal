"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import { GridColDef, GridEventListener, GridFilterModel, GridRowSelectionModel, GridValueGetterParams, getGridStringOperators } from '@mui/x-data-grid';
import { axiosInstance } from '@/utils/axiosInstance';
import { Avatar, Button, Chip, Grid, IconButton, Switch, TextField } from '@mui/material';
import SearchInput from '@/components/SearchInput';
import useConfirmation from '@/hooks/useConfirmation';
import CustomButton from '@/components/CustomButton';
import MuiDataGrid from '@/components/MuiDataGrid';
import CreateStudent from './create-student';
import { useRouter } from 'next/navigation'
import StudentFilter from './StudentFilter';
import CachedIcon from '@mui/icons-material/Cached';
import ChangeClassPopUp from './ChangeClassPopUp';
import { StudentProps } from '@/types';

export default function Page() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openChangeClass, setOpenChangeClass] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [data, setData] = useState({
        search: "",
        approval: "accepted",
        loading: true,
        rows: [],
        filter: {
            instituteFacultyId: null,
            instituteStreamId: null,
            instituteClassId: null,
        },
        count: 0,
        rowsPerPageOptions: [5, 10, 15, 20, 25],
        pageSize: 10,
        page: 0
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));
    const { showAlert, AlertComponent } = useConfirmation();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Student Name',
            flex: 1,
            minWidth: 220,
            renderCell: ({ row }) => <Box>
                <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                    <Avatar onClick={() => handleEvent(row)} alt="" src={row?.User?.avtarUrl} sx={{ marginRight: 2, width: 40, height: 40 }} />
                    <Box onClick={() => handleEvent(row)}>{row?.name}</Box>
                </Box>
            </Box>
        },
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
            minWidth: 280,
        },
        {
            field: 'className',
            headerName: 'Class',
            width: 100,
            renderCell: ({ row }) => row.className || "N/A"
        },
        (data.approval === "accepted" ? {
            field: 'statusString',
            headerName: 'Status',
            flex: 1,
            minWidth: 100,
            renderCell: ({ value, row }) => <Box
                sx={{ color: row.status === 1 ? "success.main" : "error.main" }}
            >{value}</Box>
        } : {
            field: 'changeRequest',
            headerName: 'Remark',
            flex: 1,
            minWidth: 100,
            renderCell: ({ value, row }) => <Box
                sx={{ color: "info.main" }}
            >New Request</Box>
        }),
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            minWidth: data.approval === "accepted" ? 100 : 180,
            sortable: false,
            renderCell: ({ row }) => (<>
                {data.approval === "accepted" && <Switch
                    checked={row.status === 1 ? true : false}
                    onChange={() => onStatusChange(row)}
                    size="small"
                />}
                {data.approval === "pending" && <><Button
                    onClick={() => handleShowAlert(row, "accept")}
                    size="small"
                    variant={"contained"}
                    color="success"
                    sx={{ marginRight: 2 }}
                >
                    Accept
                </Button>
                    <Button
                        onClick={() => handleShowAlert(row, "reject")}
                        size="small"
                        variant={"contained"}
                        color="error"
                    >
                        Reject
                    </Button>
                </>
                }
            </>
            ),
        },
    ];

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.post("/api/student/list", {
            offset: data.page,
            limit: data.pageSize,
            approval: data.approval,
            search: data.search,
            filter: data.filter,
        }).then((res) => {
            updateData("count", res.data.count);
            updateData("rows", res.data.rows);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [data.approval, data.pageSize, data.page, data.search, data.filter])

    const onStatusChange = (row: { id: number, status: number }) => {
        axiosInstance.post(`/api/student/update_status/${row.id}`, {
            status: row.status === 1 ? 2 : 1
        }).then((res) => {
            callApi();
        })
    }

    const handleCloseModel = (status: boolean) => {
        setOpen(false)
        setOpenChangeClass(false)
        if (status) {
            callApi()
        }
    }

    const handleShowAlert = (row: any, action: string) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.post(`/api/student/acceptOrReject/${row.id}`, {
                        status: action
                    }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    const handleEvent = (row: any) => {
        if (row?.userId) {
            router.push(`/students/${row.id}/profile`)
        }
    };

    const currentClass = useMemo(() => {
        if (openChangeClass) {
            const studentId = selectedStudents[0];
            const student: StudentProps | any = data.rows.find((s: StudentProps) => s.id === studentId);

            return {
                stream: student?.stream ?? "",
                faculty: student?.faculty ?? "",
                className: student?.className ?? ""
            }
        }
    }, [data.rows, openChangeClass, selectedStudents])

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                <Box >
                    <CustomButton
                        onClick={() => updateData("approval", "accepted")}
                        sx={{ mr: 2 }}
                        size="small"
                        active={data.approval === "accepted" ? true : false}

                    >
                        Students
                    </CustomButton>
                    <CustomButton
                        onClick={() => updateData("approval", "pending")}
                        size="small"
                        active={data.approval === "pending" ? true : false}
                    >
                        Request
                    </CustomButton>
                </Box>
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
                        placeholder='Search student'
                    />
                    <StudentFilter
                        filterOption={data.filter}
                        setFilterOption={(value: any) => updateData("filter", value)}
                    />
                    <CustomButton onClick={() => setOpenChangeClass(true)} startIcon={<CachedIcon sx={{ mt: "-2px" }} />}>Change Class</CustomButton>
                    <Button size="small" variant={"contained"}
                        onClick={() => setOpen(true)}
                    >Add Student</Button>
                </Box>
            </Box>
            <Box sx={{ mt: 2, width: '100%', background: "#fff" }} >
                <MuiDataGrid
                    pagination
                    paginationMode="server"
                    loading={data.loading}
                    rowCount={data.count}
                    rows={data.rows}
                    columns={columns}
                    paginationModel={{ pageSize: data.pageSize, page: data.page }}
                    onPaginationModelChange={(e) => {
                        updateData("page", e.page)
                        updateData("pageSize", e.pageSize)
                    }}
                    pageSizeOptions={data.rowsPerPageOptions}
                    checkboxSelection={data.approval === "accepted" ? true : false}
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(e: any) => setSelectedStudents(e)}
                />
            </Box>
            {AlertComponent}

            {open && <CreateStudent
                open={open}
                handleClose={handleCloseModel}
            />}

            {openChangeClass && <ChangeClassPopUp
                open={openChangeClass}
                selectedStudents={selectedStudents}
                currentClass={currentClass}
                handleClose={handleCloseModel}
            />}
        </>
    );
}

