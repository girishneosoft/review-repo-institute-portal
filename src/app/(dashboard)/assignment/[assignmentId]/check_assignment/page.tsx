"use client"
import MuiDataGrid from "@/components/MuiDataGrid";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import useConfirmation from '@/hooks/useConfirmation';
import Link from "next/link";
import moment from "moment";
import YearPicker from "@/components/YearPicker";
import CustomButton from "@/components/CustomButton";
import SearchInput from "@/components/SearchInput";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AssignNumberDropdown from "./AssignNumberDropdown";
import { toastMessage } from "@/utils/toastify";

interface CheckAssignmentProps {
    params: {
        assignmentId: number
    };
}

export default function CheckAssignment({ params }: CheckAssignmentProps) {

    const [studentAssignment, setStudentAssignment] = useState<any>({});
    const [questionAnswers, setQuestionAnswers] = useState<any[]>([]);

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 180,
            renderCell: ({ row }) => <>
                <Avatar alt="" src={row?.studentAvtarUrl} sx={{ marginRight: 2, width: 30, height: 30 }} />
                <Box >{row.studentName}</Box>
            </>
        },
        {
            field: 'studentGivenDate',
            headerName: 'Date',
            flex: 1,
            minWidth: 150,
            renderCell: ({ value }) => moment(value).format("DD MMM YYYY")
        },
        {
            field: 'totalQuestion',
            headerName: 'Question',
            flex: 1,
            minWidth: 150

        },
        {
            field: 'solvedQuestion',
            headerName: 'Solved',
            flex: 1,
            minWidth: 150
        },
        {
            field: 'obtainMarks',
            headerName: 'Obtain Marks',
            flex: 1,
            minWidth: 150
        },
        {
            field: 'status',
            headerName: 'Action',
            flex: 1,
            minWidth: 150,
            renderCell: ({ row }) => <>
                <Button variant="contained" size="small" sx={{ width: 120 }} onClick={handleSubmit}>Submit</Button>
            </>
        }
    ];

    const callApi = () => {
        axiosInstance.get(`/api/assignment/check_assignment/${params.assignmentId}`).then((res) => {
            setStudentAssignment(res.data);
            setQuestionAnswers(res.data?.question_answers);
        })
    }

    useEffect(() => {
        callApi()
    }, [params.assignmentId])

    const handleAssignNumber = (index: number, value: any) => {
        const _questionAnswers = [...questionAnswers]
        _questionAnswers[index]['givenMark'] = value;
        _questionAnswers[index]['isCorrect'] = value > 0 ? true : false;
        setQuestionAnswers(_questionAnswers);
    }

    const numberOption = useMemo(() => {
        if (studentAssignment) {
            const eachQuestionMark = studentAssignment?.totalMarks / studentAssignment?.totalQuestion;
            let option: any[] = [];
            for (let i = 0; i <= eachQuestionMark; i++) {
                option = [...option, i]
            }
            return option
        } else {
            return []
        }
    }, [studentAssignment])

    const handleSubmit = () => {
        axiosInstance.post(`/api/assignment/submit_checked_assignment/${params.assignmentId}`, {
            assignment_questions: questionAnswers
        }).then((res) => {
            toastMessage(res.data.message, "s")
        })
    }

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: 'space-between', mb: 2 }}>
                <Button
                    LinkComponent={Link}
                    href={`/assignment/${studentAssignment?.assignmentId}`}
                    variant="outlined"
                    size="small"
                    startIcon={<ArrowBackIosNewOutlinedIcon fontSize="small" />}
                >Back</Button>

            </Box>
            <Paper elevation={0} >
                <Box sx={{ p: 1.5 }}>
                    <Typography color="primary.main">
                        {studentAssignment?.subjectName}
                    </Typography>
                </Box>
                <Paper elevation={1} >
                    <MuiDataGrid
                        // loading={data.loading}
                        rows={[studentAssignment]}
                        columns={columns}
                        disableRowSelectionOnClick
                        getRowId={(row) => Math.random()}
                        hideFooterPagination={true}
                        sx={{
                            "& .MuiDataGrid-footerContainer": {
                                display: "none"
                            }
                        }}
                    />
                </Paper>
                <Box sx={{ mt: 2 }}>
                    {questionAnswers.map((question, index) => (
                        <Box key={question.id}>
                            <Typography sx={{
                                p: 1.2, background: "#F8FAFB"
                            }}>Q. {index + 1} {question?.question}</Typography>
                            <Box sx={{ p: 2 }} >
                                <Typography sx={{ mb: 2 }} variant="body2" color="text.secondary"> {question?.answer}</Typography>
                                <AssignNumberDropdown value={question?.givenMark} onChange={(value: any) => handleAssignNumber(index, value)} options={numberOption} />
                            </Box>
                        </Box>
                    ))}
                </Box>

            </Paper >

        </>
    )
}