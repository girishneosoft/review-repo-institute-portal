"use client"
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridEventListener, GridValueGetterParams } from '@mui/x-data-grid';
import { axiosInstance } from '@/utils/axiosInstance';
import { Avatar, Button, Chip, IconButton, styled, Switch } from '@mui/material';
import SearchInput from '@/components/SearchInput';
import useConfirmation from '@/hooks/useConfirmation';
import CustomButton from '@/components/CustomButton';
import MuiDataGrid from '@/components/MuiDataGrid';
import ReactTable from '@/components/ReactTable';
import { useRouter } from 'next/navigation'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import moment from 'moment';
import Link from 'next/link';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import StudentAssignment from "./StudentAssignment";
import AssignmentFilter from './AssignmentFilter';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export default function Page() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = useState("");
    const [data, setData] = useState({
        search: "",
        loading: true,
        status: "ongoing",
        filter: {
            facultyId: null,
            streamId: null,
            classId: null,
        },
        rows: [],
        count: 0,
        rowsPerPageOptions: [5, 10, 15],
        pageSize: 10,
        page: 0
    });

    const updateData = (k: string, v: any) => setData((prev) => ({ ...prev, [k]: v }));
    const { showAlert, AlertComponent } = useConfirmation();

    const columns: GridColDef[] = [
        {
            field: 'className',
            headerName: 'Class',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'subjectName',
            headerName: 'Subject Name',
            flex: 1,
            minWidth: 100
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            flex: 1,
            minWidth: 100,
            renderCell: ({ row }) => moment(row.startDate).format("DD MMM YYYY")
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            width: 100,
            flex: 1,
            renderCell: ({ row }) => moment(row.endDate).format("DD MMM YYYY")
        },
        {
            field: 'totalMarks',
            headerName: 'Total marks',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'teacherName',
            headerName: 'Assignee',
            flex: 1,
            minWidth: 100,
            renderCell: ({ row }) => <>{row?.teacherName}</>
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            minWidth: 100,
            sortable: false,
            renderCell: ({ row }) => (<>
                <IconButton
                    onClick={() => handleShowAlert(row)}
                    size="small"
                    color="error"
                >
                    <DeleteOutlineIcon />
                </IconButton>
                <IconButton
                    LinkComponent={Link}
                    href={`/assignment/${row.id}`}
                    size="small"
                    disabled={row.givenAssignment > 0 ? false : true}
                >
                    <RemoveRedEyeIcon />
                </IconButton>
            </>
            ),
        },
    ];

    const callApi = () => {
        updateData("loading", true);
        axiosInstance.post("/api/assignment/list", {
            status: data.status,
            offset: data.page,
            limit: data.pageSize,
            search: data.search,
        }).then((res) => {
            updateData("count", res.data.count);
            updateData("rows", res.data.rows);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [data.status, data.pageSize, data.page, data.search, data.filter])

    const handleShowAlert = (row: any) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/assignment/delete/${row.id}`)
                        .then((res) => {
                            callApi();
                        })
                }
            }
        })
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                <Box >
                    <CustomButton
                        onClick={() => updateData("status", "ongoing")}
                        sx={{ mr: 2 }}
                        size="small"
                        active={data.status === "ongoing" ? true : false}

                    >
                        Ongoing
                    </CustomButton>
                    <CustomButton
                        onClick={() => updateData("status", "completed")}
                        size="small"
                        active={data.status === "completed" ? true : false}
                    >
                        Completed
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
                    />
                    <AssignmentFilter
                        filterOption={data.filter}
                        setFilterOption={(value: any) => updateData("filter", value)}
                    />
                    <Button size="small" variant={"contained"}
                        LinkComponent={Link} href="assignment/create"
                    >Create Assignment</Button>
                </Box>
            </Box>
            <Box sx={{ mt: 2, height: "100%", width: '100%', background: "#fff" }} >

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
                    pageSizeOptions={[5]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    density='compact'
                />
            </Box>
            {AlertComponent}
        </>
    );
}

const renderSubComponent = ({ row }: { row: any }) => {
    return (
        <>
            <StudentAssignment assignmentId={row.original.id} />
        </>
    )
}