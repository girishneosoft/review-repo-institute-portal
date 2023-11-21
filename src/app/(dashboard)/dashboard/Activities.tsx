import React, { useEffect, useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MenuItem, Paper, Typography, Box } from '@mui/material';
import { axiosInstance } from '@/utils/axiosInstance';
import SelectDropdown from '@/components/SelectDropdown';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function Activities() {
    const [activities, setActivities] = useState<any>([]);

    const apiCall = () => {
        axiosInstance.post("/api/notifications", {
            offset: 0, limit: 10
        }).then((res) => {
            setActivities(res.data)
        })
    }

    useEffect(() => {
        apiCall();
    }, [])


    return (
        <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6">Notification</Typography>
            <Box sx={{ mt: 1.5 }}>
                {activities.map((item: any) => (
                    <Box key={item.id} sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
                        <Typography
                            key={item.id}
                            variant="body2"
                            sx={{ mb: 0.5 }}
                        >{item.notification}</Typography>
                        {/* <Typography color="text.secondary" variant="body2" >-</Typography>
                        <Typography color="text.secondary" variant="caption" >({moment(item.createdAt).format("DD MMM YYYY")})</Typography> */}
                    </Box>
                ))}
            </Box>
        </Paper >
    );
}