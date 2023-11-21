"use client"
import { useEffect, useState } from 'react';
import AssignmentForm from "./AssignmentForm";
import QuestionForm from "./QuestionForm";
import Link from 'next/link';

export default function Page() {
    const [assignment, setAssignment] = useState({});
    const [activeTab, setActiveTab] = useState("assignmentForm");

    const storeAssignmentInfo = (data: any) => {
        setAssignment(data)
        setActiveTab("questionForm")
    }

    return (
        <>
            {activeTab === "assignmentForm" && <AssignmentForm onSubmit={storeAssignmentInfo} />}
            {activeTab === "questionForm" && <QuestionForm assignment={assignment} />}
        </>
    )

}

