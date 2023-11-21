"use client"
import { Box, IconButton, Paper, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { CompanyProps, PlaceStudentProps } from "@/types";

import useConfirmation from "@/hooks/useConfirmation";
import AddCompany from "./AddCompany";
import AddPlacedStudent from "./AddPlacedStudent";
import CompanyList from "./CompanyList";
import PlacedStudentList from "./PlacedStudentList";

export default function Placement() {
    const { showAlert, AlertComponent } = useConfirmation();
    const [companies, setCompanies] = useState<{ loading: boolean, rows: CompanyProps[] }>({ loading: false, rows: [] });
    const [students, setStudents] = useState<{ loading: boolean, rows: PlaceStudentProps[] }>({ loading: false, rows: [] });

    const onArchiveCompany = (row: CompanyProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/placement/company/${row.id}`, { withCredentials: true }).then((res) => {
                        getCompanyList();
                    })
                }
            }
        })
    }

    const onArchivePlacedStudent = (row: PlaceStudentProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/institute/placement/student/${row.id}`, { withCredentials: true }).then((res) => {
                        getPlacedStudentList();
                    })
                }
            }
        })
    }

    const getCompanyList = () => {
        setCompanies({ ...companies, loading: true })
        axiosInstance.get("/api/institute/placement/company/list").then((res) => {
            setCompanies({ rows: res.data, loading: false })
        })
    }

    const getPlacedStudentList = () => {
        setStudents({ ...students, loading: true })
        axiosInstance.get("/api/institute/placement/student/list").then((res) => {
            setStudents({ rows: res.data, loading: false })
        })
    }

    useEffect(() => {
        getCompanyList()
        getPlacedStudentList()
    }, [])

    return (
        <>
            <Paper sx={{ p: 1, mt: 1 }} elevation={0} >
                <Typography sx={{ mb: 1 }}>Our partners</Typography>
                <AddCompany callApi={getCompanyList} />

                <CompanyList
                    loading={companies.loading}
                    companies={companies.rows}
                    onArchiveCompany={onArchiveCompany}
                />

                <Typography sx={{ mb: 1, mt: 2 }}>Selected Student</Typography>

                <AddPlacedStudent companies={companies.rows} callApi={getPlacedStudentList} />

                <PlacedStudentList
                    loading={students.loading}
                    students={students.rows}
                    onArchivePlacedStudent={onArchivePlacedStudent}
                />
            </Paper >

            {AlertComponent}
        </>
    )
}