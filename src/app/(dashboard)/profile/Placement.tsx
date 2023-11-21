"use client"
import { Avatar, Box, Grid, IconButton, MenuItem, Paper, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { CompanyProps, FacilityProps, PlaceStudentProps } from "@/types";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import useConfirmation from "@/hooks/useConfirmation";
import Loader from "@/components/Loader";

const ArchiveButton = styled(IconButton)({
    top: 0,
    right: 0,
    background: 'white',
    border: '1px solid',
    borderRadius: "5px",
    position: "absolute",
    padding: 1,
    "& :hover, :active, :focus": {
        background: 'white',
    }
})

const Wrapper = styled(Box)({
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    position: "relative",
})



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
            <Paper sx={{ p: 1, mt: 1 }}>
                <Typography sx={{ color: "primary.main", mb: 1 }}>Our partners</Typography>
                {companies?.loading && <Loader minHeight={150} />}

                {!companies.loading && companies.rows.length === 0 && <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
                    <Typography color="text.secondary">No Partners</Typography>
                </Box>}

                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, overflowX: 'scroll' }}>
                    {companies.rows.map((item) => (
                        <Wrapper key={item.id} sx={{ mb: 2, minWidth: 120 }}>
                            <Avatar
                                sx={{ height: 70, width: 120 }}
                                variant="square" src={item?.companyLogo}
                            >
                                {item?.companyName}
                            </Avatar>
                            <Typography variant="subtitle2" sx={{ textAlign: "center", color: "primary.main" }}>{item?.companyName}</Typography>
                            <ArchiveButton color="error" size="small" onClick={() => onArchiveCompany(item)}>
                                <DeleteOutlineIcon fontSize="small" />
                            </ArchiveButton>
                        </Wrapper>
                    ))}
                </Box>

                <Typography sx={{ color: "primary.main", mb: 1 }}>Selected Student</Typography>
                {students.loading && <Loader minHeight={150} />}

                {!students.loading && students.rows.length === 0 && <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
                    <Typography color="text.secondary">No Students</Typography>
                </Box>}

                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, overflowX: 'scroll' }}>
                    {students.rows.map((item) => (
                        <Wrapper component={Paper} key={item.id} sx={{ mb: 2, p: 2, minWidth: 180 }}>
                            <Avatar
                                sx={{ height: 50, width: 50 }}
                                variant="square" src={item?.studentAvtar}
                            />
                            <Typography variant="subtitle2" sx={{ textAlign: "center", }}>{item?.studentName}</Typography>
                            <Typography variant="subtitle2" sx={{ textAlign: "center", color: "text.secondary" }}>{item?.companyName}</Typography>
                            <Typography variant="subtitle2" sx={{ textAlign: "center" }}>(Package: {item?.package})</Typography>
                            <ArchiveButton color="error" size="small" onClick={() => onArchivePlacedStudent(item)}>
                                <DeleteOutlineIcon fontSize="small" />
                            </ArchiveButton>
                        </Wrapper>
                    ))}
                </Box>
            </Paper >

            {AlertComponent}
        </>
    )
}