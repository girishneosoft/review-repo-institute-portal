import React, { useState, useEffect } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { axiosInstance } from '@/utils/axiosInstance';
import { FacilityProps, FeesProps } from '@/types';
import useConfirmation from '@/hooks/useConfirmation';
import AddFacility from "./AddFacility"


export default function Facility({ }) {
    const { showAlert, AlertComponent } = useConfirmation();

    const [facilities, setFacilities] = useState<FacilityProps[]>([]);
    const [isLoading, setIsLoading] = useState(false)

    const getFacilityListApi = () => {
        setIsLoading(true)
        axiosInstance.get("/api/institute/facility/list").then((res) => {
            setFacilities(res.data)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getFacilityListApi();
    }, [])

    const onArchive = (row: FacilityProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/facility/${row.id}`, { withCredentials: true }).then((res) => {
                        getFacilityListApi();
                    })
                }
            }
        })
    }

    return (
        <div>

            <AddFacility callApi={getFacilityListApi} />

            <Box component="div" sx={{ mt: 2, p: 1 }}>

                {facilities.map((item) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle2">Facilities: {item.title}</Typography>
                            <IconButton size="small" color="error" onClick={() => onArchive(item)}><DeleteOutlineIcon fontSize="small" /> </IconButton>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{item.desc}</Typography>
                    </Box>
                ))}

            </Box>

            {AlertComponent}
        </div >
    );
}