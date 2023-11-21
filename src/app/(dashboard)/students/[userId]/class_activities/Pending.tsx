"use client"
import { axiosInstance } from "@/utils/axiosInstance";
import { Box, Paper, Typography, styled, Grid, Skeleton } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";

const Title = styled(Typography)(({ theme }) => ({
    textAlign: "center",
    background: "#F0F3FF",
    padding: "5px",
    color: "primary.main"
}))

interface PendingProps {
    params: {
        userId: string
    }
}


export default function Pending({ params }: PendingProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [pendingExams, setPendingExam] = useState<any[]>([]);
    const [pendingAssignment, setPendingAssignment] = useState<any[]>([]);

    useEffect(() => {
        setIsLoading(true)
        axiosInstance(`/api/student/${params.userId}/pending_exam`).then((res) => {
            setPendingExam(res.data)
            setIsLoading(false)
        })
        axiosInstance(`/api/student/${params.userId}/pending_assignment`).then((res) => {
            setPendingAssignment(res.data)
        })
    }, [])

    return (
        <>
            <Box>
                <Grid container >
                    <Grid item xs={12} md={4} >
                        <Typography>Assignment</Typography>
                        {isLoading && [0, 1].map((item) => (
                            <Skeleton key={item} variant="rectangular" height={100} sx={{ mt: 1 }} />
                        ))}
                        {!isLoading && pendingAssignment.map((item) => (
                            <PendingItem key={item.id} item={item} />
                        ))}
                        {!isLoading && pendingAssignment.length === 0 && <EmptyData>No Pending assignment</EmptyData>}

                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }} >
                    <Grid item xs={12} md={4} >
                        <Typography>Exam</Typography>
                        {isLoading && [0, 1].map((item) => (
                            <Skeleton key={item} variant="rectangular" height={100} sx={{ mt: 1 }} />
                        ))}
                        {!isLoading && pendingExams.map((item) => (
                            <PendingItem key={item.id} item={item} />
                        ))}
                        {!isLoading && pendingExams.length === 0 && <EmptyData>No Pending exam</EmptyData>}
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

const PendingItem = ({ item }: any) => {
    return (
        <Paper elevation={1} sx={{ mt: 1 }}>
            <Title variant="subtitle2" >
                {item.subjectName}
            </Title>
            <Box sx={{ p: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>Marks:</Typography>
                        <Typography variant="body2" >{item.totalMarks}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>Due:</Typography>
                        <Typography variant="body2" >{moment(item.endDate ?? item.examDate).format("DD MMM YYYY")}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, mt: 1 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Assignee:</Typography>
                    <Typography variant="body2" >{item.teacherName}</Typography>
                </Box>
            </Box>
        </Paper>
    )
}

const EmptyData = ({ children }: any) => {
    return (
        <Paper elevation={0} sx={{
            mt: 1,
            display: "flex",
            justifyContent: "center",
            minHeight: "100px",
            alignItems: "center",
        }}>
            <Typography sx={{ color: "text.secondary" }}>{children}</Typography>
        </Paper >
    )
}