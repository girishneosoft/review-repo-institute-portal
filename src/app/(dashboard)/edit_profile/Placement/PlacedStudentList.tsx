"use client"
import { Avatar, Box, Grid, IconButton, MenuItem, Paper, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { CompanyProps, FacilityProps, PlaceStudentProps } from "@/types";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import useConfirmation from "@/hooks/useConfirmation";
import AddCompany from "./AddCompany";
import CompanyList from "./CompanyList";
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

interface PlacedStudentListProps {
    loading: boolean;
    students: PlaceStudentProps[];
    onArchivePlacedStudent: any;
}

export default function PlacedStudentList({ loading, students, onArchivePlacedStudent }: PlacedStudentListProps) {
    return (
        <>
            {loading && <Loader minHeight={150} />}

            {!loading && students.length === 0 && <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
                <Typography color="text.secondary">No Students</Typography>
            </Box>}

            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, overflowX: 'scroll' }}>
                {students.map((item) => (
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

        </>
    )
}