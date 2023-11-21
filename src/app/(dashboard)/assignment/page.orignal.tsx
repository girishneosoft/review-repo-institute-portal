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
import { useRouter } from 'next/navigation'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import moment from 'moment';
import Link from 'next/link';

export default function Page() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = useState("");
    const [data, setData] = useState({
        search: "",
        loading: true,
        status: "ongoing",
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
            renderCell: ({ row }) => moment(row.endDate).format("DD MMM YYYY")
        },
        {
            field: 'totalMarks',
            headerName: 'Total marks',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'givenAssignment',
            headerName: 'Given Students',
            flex: 1,
            minWidth: 100,
            renderCell: ({ row }) => <>{row?.givenAssignment}</>
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            minWidth: 100,
            sortable: false,
            renderCell: ({ row }) => (<>
                <IconButton
                    onClick={() => handleShowAlert(row, "reject")}
                    size="small"
                    color="error"
                >
                    <DeleteOutlineIcon />
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
    }, [data.status, data.pageSize, data.page, data.search])

    const handleCloseModel = (status: boolean) => {
        setOpen(false)
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
                    <Button size="small" variant={"contained"}
                        LinkComponent={Link} href="assignment/add"
                        onClick={() => setOpen(true)}
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