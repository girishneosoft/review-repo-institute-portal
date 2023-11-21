import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);



export default function PiaChart({ graphData }: any) {

    const data = {
        labels: ['Student', 'Teacher'],
        datasets: [
            {
                label: 'total',
                data: [graphData?.student, graphData?.teacher],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            <Paper sx={{ p: 2 }}>
                <Typography>Students</Typography>
                <Pie data={data} />
            </Paper>
        </>
    );
}
