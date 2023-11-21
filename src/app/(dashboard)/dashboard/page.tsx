"use client"
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Grid, Box, Chip, Paper, Typography, styled } from "@mui/material";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/utils/axiosInstance';
import AttendanceGraph from "./AttendanceGraph";
import { createGlobalStyle } from 'styled-components';
import Activities from './Activities';
import PiaChart from './PiaChart';
import ClassReport from './ClassReport';

const GlobalStyle = createGlobalStyle`
    *{
        -ms-overflow-style: none;
    }
    ::-webkit-scrollbar {
        display: none;
    }
`;
const DashboardCount = styled(Paper)({
    padding: "16px",
    textAlign: 'center',
    border: "2px solid #ECEEF6",
    height: "100%"
})

const CountTitle = styled(Typography)({
    fontWeight: 700,
    fontSize: "14px",
})

const CountValue = styled(Typography)({
    fontWeight: 700,
    fontSize: "28px",
    marginTop: 16,
})

export default function Page() {
    const [counts, setCounts] = useState<any>({})

    const apiCall = () => {
        axiosInstance("/api/dashboard/counts").then((res) => {
            setCounts(res.data)
        })
    }
    useEffect(() => {
        apiCall();
    }, [])

    return (
        <>
            <GlobalStyle />
            <Grid container spacing={2} >
                <Grid item md={12 / 7} sm={6} xs={12}>
                    <CountTile title={"Total Students"} value={counts?.teacher} percentage={false} />
                </Grid>
                <Grid item md={12 / 7} sm={6} xs={12}>
                    <CountTile title={"Total Teachers"} value={counts?.student} percentage={false} />
                </Grid>
                <Grid item md={12 / 4.2} sm={6} xs={12}>
                    <CountTile title={"Total Attendance"} value={counts?.attendance} percentage={counts?.attendanceGrowth} />
                </Grid>
                <Grid item md={12 / 4.5} >
                    <CountTile title={"Exam Report"} value={counts?.exam} percentage={counts?.examGrowth} />
                </Grid>
                <Grid item md={12 / 4} sm={6} xs={12}>
                    <CountTile title={"Assignment Report"} value={counts?.assignment} percentage={counts?.assignmentGrowth} />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 0.3 }}>
                <Grid item md={8.5} sm={12} xs={12}>
                    <AttendanceGraph />
                    <Grid container spacing={2} sx={{ mt: 0.3 }}>
                        <Grid item md={8} sm={12} xs={12}>
                            <ClassReport />
                        </Grid>
                        <Grid item md={4} sm={12} xs={12}>
                            <PiaChart graphData={counts} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={3.5} sm={12} xs={12}>
                    <Activities />
                </Grid>
            </Grid >
        </>
    )
}

const CountTile = ({ title, value, percentage }: any) => {
    return (
        <DashboardCount elevation={0} >
            <Box sx={{ display: "flex", gap: 2 }}>
                <CountTitle>{title}</CountTitle>
                {percentage !== false &&
                    <>
                        {parseFloat(percentage) >= 0 ?
                            <Chip icon={
                                <TrendingUpIcon sx={{ fill: '#0B8A00' }} />}
                                size="small" sx={{ backgroundColor: "#23c10a45", color: "#0B8A00" }}
                                label={`${Number(percentage).toFixed(0)}%`}
                            /> :
                            <Chip icon={
                                <TrendingDownIcon sx={{ fill: '#C71026' }} />}
                                size="small" sx={{ backgroundColor: "#c10a0a40", color: "#C71026" }}
                                label={`${Number(percentage).toFixed(0)}%`}
                            />
                        }
                    </>
                }
            </Box>
            <CountValue>{value}</CountValue>
        </DashboardCount>
    )
}