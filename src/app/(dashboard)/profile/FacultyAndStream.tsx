"use client"
import SelectDropdown from "@/components/SelectDropdown";
import { Box, Grid, MenuItem, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { FeesProps, InstituteFacultiesProps, InstituteFeesProps, InstituteStreamProps } from "@/types";
import MuiDataGrid from "@/components/MuiDataGrid";
import { GridColDef, GridRowHeightParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
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
                        {/* <IconButton aria-label="delete" sx={{ padding: "1px" }} color="error" size="small" onClick={() => onArchive(item)} >
                            <DeleteOutlineIcon sx={{ fontSize: "16px" }} />
                        </IconButton> */}
                    </Box>
                ))}
            </Box>
        )
    }
];

export default function FacultyAndStream() {
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [streams, setStreams] = useState<InstituteStreamProps[]>([]);
    const [filter, setFilter] = useState({ facultyId: 0, streamId: 0 });

    const [feesList, setFeesList] = useState<InstituteFeesProps[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const getFeesListApi = () => {
        setIsLoading(true)
        axiosInstance.get("/api/institute/fees/list").then((res) => {
            const data = res.data
            setFeesList(data)

            setIsLoading(false)
        })
    }

    useEffect(() => {
        getFeesListApi();
    }, [])

    useEffect(() => {
        axiosInstance.get("/api/institute/faculties").then((res) => {
            setFaculties(res.data)
            if (res.data.length > 0) {
                setFilter({ ...filter, facultyId: res.data[0].facultyId })
            }
        })
    }, [])

    useEffect(() => {
        if (filter?.facultyId) {
            axiosInstance.get("/api/institute/streams", {
                params: { facultyId: filter?.facultyId }
            }).then((res) => {
                setStreams(res.data)
                if (res.data.length > 0) {
                    setFilter({ ...filter, streamId: res.data[0].streamId })
                }
            })
        }
    }, [filter?.facultyId])

    const feesData = useMemo(() => {
        let _feesList = [...feesList];

        if (filter.facultyId) {
            _feesList = _feesList.filter((f) => f.instituteFacultyId === filter.facultyId)
        }
        if (filter.streamId) {
            _feesList = _feesList.filter((f) => f.instituteStreamId === filter.streamId)
        }
        return _feesList;
    }, [feesList, filter])

    return (
        <>
            <Grid container sx={{ mt: 2 }}>
                <Grid item sm={3}>
                    <Box>
                        <SelectDropdown
                            label="Select Faculty"
                            size="small"
                            onChange={(e: any) => setFilter({ facultyId: e.target.value, streamId: 0 })}
                            value={filter.facultyId}
                        >
                            {faculties.map((item) => (
                                <MenuItem key={item.facultyId} value={item.facultyId}>{item.name}</MenuItem>
                            ))}
                        </SelectDropdown>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <SelectDropdown
                            label="Select Stream"
                            size="small"
                            onChange={(e: any) => setFilter({ ...filter, streamId: e.target.value })}
                            value={filter.streamId}
                        >
                            {streams.map((item) => (
                                <MenuItem key={item.streamId} value={item.streamId}>{item.streamName}</MenuItem>
                            ))}
                        </SelectDropdown>
                    </Box>
                </Grid>
                <Grid item sm={3}>
                </Grid>
                <Grid item sm={6} >
                    <MuiDataGrid
                        loading={isLoading}
                        rows={feesData}
                        columns={columns}
                        getRowId={(row) => row.instituteClassId}
                        getRowHeight={({ model, densityFactor }: GridRowHeightParams) => {
                            return ((model?.fees?.length * 15) + 40) * densityFactor;
                        }}
                        disableRowSelectionOnClick
                    />
                </Grid>
            </Grid>
        </>
    )
}