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


export default function AttendanceGraph() {
    const [type, setType] = useState("month");
    const [graphData, setGraphData] = useState<any>([]);



    const apiCall = () => {
        axiosInstance("/api/dashboard/report_graph_data", {
            params: { type: type }
        }).then((res) => {
            setGraphData(res.data)
        })
    }

    const structureData = useMemo(() => {
        let dataObj: any = { total: {}, present: {} };
        if (type === "month") {
            graphData.map((s: any) => {
                dataObj['present'][moment(s.date).format("DD")] = s.presentCount;
                dataObj['total'][moment(s.date).format("DD")] = s.total - s.presentCount;
            })
        } else {
            graphData.map((s: any) => {
                dataObj['present'][s.month] = s.presentCount;
                dataObj['total'][s.month] = s.total - s.presentCount;
            })
        }
        return dataObj;
    }, [graphData])

    const options = {
        plugins: {
            title: {
                display: false,
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },

    };


    useEffect(() => {
        apiCall();
    }, [type])

    const labels = type === "month" ? getDayNumbersOfCurrentMonth() : months;

    const data: any = {
        labels,
        datasets: [
            {
                label: 'Present',
                data: labels.map((_, index) => structureData['present'][index + 1]),
                backgroundColor: '#0A84FF',
            },
            {
                label: 'Absent',
                data: labels.map((_, index) => structureData['total'][index + 1]),
                backgroundColor: 'rgb(75, 192, 192)',
            }
        ],
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Attendance Report</Typography>
                <SelectDropdown sx={{ width: 150 }} size="small" defaultValue={type} onChange={(v: any) => setType(v.target.value)}>
                    <MenuItem value="year">Year</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                </SelectDropdown>
            </Box>
            <Bar options={options} height={80} data={data} />
        </Paper>
    );
}

function getDayNumbersOfCurrentMonth() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0); // Setting day to 0 gets the last day of the previous month

    const dayNumberArray = [];
    let currentDate = firstDayOfMonth;

    while (currentDate <= lastDayOfMonth) {
        dayNumberArray.push(currentDate.getDate());
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dayNumberArray;
}

const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];