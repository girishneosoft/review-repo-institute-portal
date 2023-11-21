import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { axiosInstance } from '@/utils/axiosInstance';
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import { FeesProps, InstituteClassProps, InstituteFacultiesProps, InstituteFeesProps, InstituteStreamProps, InstituteSubjectProps } from '@/types';
import MuiDataGrid from '@/components/MuiDataGrid';
import { GridColDef, GridRowHeightParams } from '@mui/x-data-grid';
import useConfirmation from '@/hooks/useConfirmation';
import AddFees from "./AddFees"


export default function FacultyAndStreamUpdate({ }) {
    const { showAlert, AlertComponent } = useConfirmation();

    const [feesList, setFeesList] = useState<InstituteFeesProps[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const getFeesListApi = () => {
        setIsLoading(true)
        axiosInstance.get("/api/institute/fees/list").then((res) => {
            setFeesList(res.data)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getFeesListApi();
    }, [])

    const columns: GridColDef[] = [
        {
            field: 'faculty',
            headerName: 'Faculty',
            flex: 1,
        },
        {
            field: 'stream',
            headerName: 'Stream/ Branch',
            flex: 1,
        },
        {
            field: 'className',
            headerName: 'Class',
            flex: 1,
        },
        {
            field: 'fees',
            headerName: 'Fees',
            flex: 1,
            renderCell: ({ row }) => (
                <Box>
                    {row.fees.map((item: FeesProps) => (
                        <Box key={item.id} sx={{ color: "text.secondary", display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
                            <Typography variant='subtitle2'>{item.caste}:- </Typography>
                            <Typography variant='subtitle2'>{item.fees}</Typography>
                            <IconButton aria-label="delete" sx={{ padding: "1px" }} color="error" size="small" onClick={() => onArchive(item)} >
                                <DeleteOutlineIcon sx={{ fontSize: "16px" }} />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            )
        }
    ];

    const onArchive = (row: FeesProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/fees/${row.id}`, { withCredentials: true }).then((res) => {
                        getFeesListApi();
                    })
                }
            }
        })
    }

    return (
        <div>

            <AddFees callApi={getFeesListApi} />

            <Box component="div" sx={{ mt: 2 }}>
                <Typography sx={{ color: "primary.main", mt: 3, mb: 1 }}>Added Fees</Typography>
                <MuiDataGrid
                    loading={isLoading}
                    rows={feesList}
                    columns={columns}
                    getRowId={(row) => row.instituteClassId}
                    getRowHeight={({ id, model, densityFactor }: GridRowHeightParams) => {
                        return ((model?.fees?.length * 15) + 40) * densityFactor;
                    }}
                    disableRowSelectionOnClick
                />
            </Box>

            {AlertComponent}
        </div >
    );
}