import CustomButton from "@/components/CustomButton";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, Paper, Box, Typography, Button, Rating, styled, Grid } from "@mui/material";

import { InstituteProps } from "@/types";
import Profile from "./Profile";
import FacultyAndStream from "./FacultyAndStream";
import EntranceExam from "./EntranceExam";
import Facility from "./Facility";
import Placement from "./Placement";
import Governance from "./Governance";
import Link from "next/link";
import Gallery from "./Gallery";

// const BannerImg = styled(Avatar)({
//     height: "150px",
//     width: "100%",
//     borderRadius: 0,
//     bgcolor: "#fafaff"
// })

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

async function getInstituteDetails() {
    const res = await axiosInstance.get("/api/institute/profile_details")
    return res.data;
}

async function getInstitutePosts() {
    const res = await axiosInstance.get(`/api/posts`)
    return res.data;
}

export default async function Page({ searchParams }: any) {
    const [institute, posts] = await Promise.all([getInstituteDetails(), getInstitutePosts()])

    const activeTab = searchParams?.t ?? "";

    return (
        <>
            <Paper sx={{ p: 1 }} elevation={0}>
                <Avatar src={institute?.institute?.bannerPath} variant="square" sx={{
                    height: "150px",
                    width: "100%",
                    borderRadius: 0,
                    bgcolor: "rgb(231, 240, 255)"
                }} >
                    {institute.instituteName ?? "Institute Name"}
                </Avatar>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 3 }}>
                        <Box sx={{ position: "relative", height: 80, width: 80 }}>
                            <Avatar variant="rounded" src={institute?.avtarUrl} sx={{ height: 80, width: 80, position: "absolute", top: "-15px", left: "10px", borderRadius: 2 }} />
                        </Box>
                        <Box>
                            <Typography>{institute?.instituteName}</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>{institute?.userName}</Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>Connection 200k</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1.5, alignItems: "baseline", mt: 1 }}>
                        <Button variant="outlined" size="small" LinkComponent={Link} href="/edit_profile">Edit Profile</Button>
                        <Button variant="contained" size="small">Share post</Button>
                        <Box sx={{ textAlign: "center" }}>
                            <Rating value={institute?.institute?.instituteRating} size="small" />
                            <Typography sx={{ color: "text.secondary" }}>{institute?.institute?.instituteRating}/5</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mt: 2, flexWrap: "wrap" }}>
                    {pills.map((item) => (
                        <CustomButton
                            LinkComponent={Link}
                            href={item.key ? `/profile?t=${item.key}` : `/profile`}
                            key={item.key}
                            active={activeTab === item.key ?? ""}
                        >{item.name}</CustomButton>
                    ))}
                </Box>

                {!activeTab && <Profile institute={institute} posts={posts} />}
                {activeTab === "facultyStream" && <FacultyAndStream />}
                {activeTab === "entranceExam" && <EntranceExam />}
                {activeTab === "facility" && <Facility />}
                {activeTab === "placement" && <Placement />}
                {activeTab === "governance" && <Governance institute={institute} />}
                {activeTab === "gallery" && <Gallery />}
            </Paper>
        </>
    )
}