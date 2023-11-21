"use client"
import { useEffect, useState } from 'react';
import ExamForm from "./ExamForm";
import QuestionForm from "./QuestionForm";
import Link from 'next/link';
import { Box, Button } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

export default function Page() {
    const [assignment, setAssignment] = useState({});
    const [activeTab, setActiveTab] = useState("examForm");

    const storeAssignmentInfo = (data: any) => {
        setAssignment(data)
        setActiveTab("questionForm")
    }

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Button
                    LinkComponent={Link}
                    href="/exams"
                    variant="outlined" size="small"
                    startIcon={<ArrowBackIosNewOutlinedIcon />}
                >Back</Button>
            </Box>
            {activeTab === "examForm" && <ExamForm onSubmit={storeAssignmentInfo} />}
            {activeTab === "questionForm" && <QuestionForm assignment={assignment} />}
        </>
    )

}

