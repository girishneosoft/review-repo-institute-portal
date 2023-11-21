"use client"
import React, { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '@/utils/axiosInstance';
import { Avatar, Box, Button, Skeleton } from '@mui/material';
import { Paper, Typography } from '@mui/material';
import CountTitle from './CountTitle';
import AddReportCard from './AddReportCard';
import CustomButton from '@/components/CustomButton';
import { InstituteClassProps, StudentReportCardProps } from '@/types';

interface InfoProps {
    params: {
        userId: string
    }
}

export default function Info({ params }: InfoProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [reportCards, setReportCards] = useState<StudentReportCardProps[]>([])
    const [classes, setClasses] = useState<InstituteClassProps[]>([])
    const [selectedClass, setSelectedClass] = useState<number>(0)
    const [openReportCardModal, setOpenReportCardModal] = useState<boolean>(false)
    const [info, setInfo] = useState({
        attendance: 0,
        assignment: 0,
        exam: 0,
        performance: 0
    });

    const getReportCards = () => {
        axiosInstance.get(`/api/institute/student/${params.userId}/report_cards`).then((res) => {
            setReportCards(res.data)
        })
    }

    useEffect(() => {
        setIsLoading(true)
        axiosInstance.get(`/api/student/${params.userId}/class/performance`).then((res) => {
            setInfo(res.data)
            setIsLoading(false)
        })
        axiosInstance.get(`/api/institute/classes`, {
            params: {
                studentId: params.userId,
                parentClassOnly: true
            }
        }).then((res) => {
            setClasses(res.data)
            if (res.data.length > 0) {
                setSelectedClass(res.data[0]?.classId)
            }
        })
        getReportCards();
    }, [params])

    const reportCard = useMemo(() => {
        return reportCards.find((item) => item.instituteStreamClassId === selectedClass)?.reportCardUrl;
    }, [selectedClass, reportCards])

    const handleClose = (status: boolean = false) => {
        setOpenReportCardModal(false)
        if (status) {
            getReportCards();
        }
    }

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                {isLoading && [0, 1, 2, 3].map((item) => (
                    <Skeleton key={item} variant="rectangular" width={210} height={60} />
                ))}
                {!isLoading && <>
                    <CountTitle title="Attendance" value={`${Math.round(info.attendance) ?? 0}%`} valueColor="error.light" />
                    <CountTitle title="Assignment" value={`${Math.round(info.assignment) ?? 0}%`} valueColor="error.light" />
                    <CountTitle title="Exam" value={`${Math.round(info.exam) ?? 0}%`} valueColor="error.light" />
                    <CountTitle title="Performance" value={`${Math.round(info.performance) ?? 0}%`} valueColor="error.light" />
                </>}
            </Box>
            <Box sx={{ mt: 2 }}>
                {!isLoading && <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant='h6' sx={{ color: "primary" }}>Report Card</Typography>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => setOpenReportCardModal(true)}
                    >Add Report Card</Button>
                </Box>}
                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, mt: 1 }}>
                    {isLoading && [0, 1, 2, 3].map((item) => (
                        <Skeleton key={item} variant="rectangular" width={80} height={30} />
                    ))}
                    {!isLoading && classes.map((c) => (
                        <CustomButton
                            key={c.classId}
                            active={selectedClass === c.classId}
                            onClick={() => setSelectedClass(c.classId)}
                        >{c.className ?? "Report card"}</CustomButton>
                    ))}
                </Box>
                <Box sx={{ mt: 2 }}>
                    {isLoading && <Skeleton variant="rectangular" width={120} height={180} />}
                    {!isLoading && <Avatar
                        variant='square'
                        sx={{ width: 120, height: 180 }}
                        src={reportCard}
                    >
                        {classes.find((c) => c.classId === selectedClass)?.className}
                    </Avatar>}
                </Box>
            </Box>

            {openReportCardModal && <AddReportCard
                open={openReportCardModal}
                classes={classes}
                studentId={params.userId}
                handleClose={handleClose}
            />}
        </>
    )
}