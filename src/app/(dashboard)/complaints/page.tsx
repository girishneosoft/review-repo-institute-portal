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
import moment from 'moment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function Page() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = useState("");
    const [data, setData] = useState({
        search: "",
        approval: "accepted",
        loading: true,
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
            field: 'createdAt',
            headerName: 'Date',
            flex: 1,
            minWidth: 100,
            renderCell: ({ row }) => <>{moment(row.createdAt).format("DD MMM YYYY")}</>
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 180

        },
        {
            field: 'title',
            headerName: 'Complaint',
            flex: 1,
            minWidth: 350

        },
        {
            field: 'statusString',
            headerName: 'Status',
            flex: 1,
            minWidth: 100,
            renderCell: ({ value, row }) => <Box
                sx={{
                    color: row.status === 2 ? "success.main" : (row.status === 3 ? "error.main" : " #F7CB73")
                }}
            > {value}</Box >
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            renderCell: ({ row }) => (<>
                <IconButton onClick={() => handleShowAlert(row.id, 2)} color="success" aria-label="add to shopping cart">
                    <CheckIcon />
                </IconButton>
                <IconButton onClick={() => handleShowAlert(row.id, 3)} color="error" aria-label="add to shopping cart">
                    <CloseIcon />
                </IconButton>
            </>
            ),
        },
    ];


    const callApi = () => {
        updateData("loading", true);
        axiosInstance.post("/api/complaint/list", {
            offset: data.page,
            limit: data.pageSize,
            approval: data.approval,
            search: data.search,
            filter: {
                "name": "",
                "faculty": "",
                "stream": "",
                "status": ""
            }
        }).then((res) => {
            updateData("count", res.data.count);
            updateData("rows", res.data.rows);
            updateData("loading", false);
        })
    }

    useEffect(() => {
        callApi()
    }, [data.approval, data.pageSize, data.page, data.search])


    const handleShowAlert = (id: number, status: number) => {
        showAlert({
            onAction: (action: string) => {
                if (action === "ok") {
                    axiosInstance.post(`/api/complaint/resolveOrReject/${id}`, {
                        status: status
                    }).then((res) => {
                        callApi();
                    })
                }
            }
        })
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'flex-end' }}>
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
                    getRowHeight={() => 'auto'}
                />
            </Box>
            {AlertComponent}

        </>
    );
}