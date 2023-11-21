"use client"
import CustomButton from "@/components/CustomButton";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, Paper, Box, Container, Button, Rating, styled, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { InstituteProps } from "@/types";
import Link from "next/link";
import ProfileUpdate from "./ProfileUpdate";
import FacultyAndStreamUpdate from "./FacultyAndStreamUpdate";
import EntranceExam from "./EntranceExam";

import Facility from "./Facility";
import Gallery from "./Gallery";
import Governance from "./Governance";
import Placement from "./Placement";

const BannerImg = styled(Avatar)({
    height: "150px",
    width: "100%",
    borderRadius: 0,
    bgcolor: "#fafaff"
})

const pills = [
    {
        key: "",
        name: "Profile",
    }, {
        key: "facultyStream",
        name: "Faculty & Stream",
    }, {
        key: "entranceExam",
        name: "Entrance Exam",
    },
    {
        key: "facility",
        name: "Facility",
    },
    {
        key: "placement",
        name: "Placement",
    },
    {
        key: "governance",
        name: "Governance",
    },
    {
        key: "gallery",
        name: "Gallery",
    }
]

export default function Page({ searchParams }: any) {
    const [isLoading, setIsLoading] = useState(false);
    const [institute, setInstitute] = useState<InstituteProps | any>({});

    useEffect(() => {
        setIsLoading(true)
        axiosInstance("/api/institute/profile_details").then((res) => {
            setInstitute(res.data)
            setIsLoading(false)
        })
    }, [])

    const activePill = searchParams?.t ?? "";

    return (
        <>
            <Container>
                <Paper sx={{ p: 1 }} elevation={0}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Button
                            LinkComponent={Link}
                            href="/profile"
                            variant="outlined" size="small"
                        >Back</Button>
                    </Box>

                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, flexWrap: 'wrap' }}>
                            {pills.map((item) => (
                                <CustomButton
                                    LinkComponent={Link}
                                    key={item.key}
                                    href={item.key ? `/edit_profile?t=${item.key}` : `/edit_profile`}
                                    active={activePill === item.key}
                                >{item.name}</CustomButton>
                            ))}
                        </Box>

                        <Box>
                            {!activePill && <ProfileUpdate institute={institute} isLoading={isLoading} />}
                            {activePill === "facultyStream" && <FacultyAndStreamUpdate />}
                            {activePill === "entranceExam" && <EntranceExam />}
                            {activePill === "facility" && <Facility />}
                            {activePill === "placement" && <Placement />}
                            {activePill === "governance" && <Governance institute={institute} />}
                            {activePill === "gallery" && <Gallery />}
                        </Box>
                    </Paper>
                </Paper>
            </Container>
        </>
    )
}