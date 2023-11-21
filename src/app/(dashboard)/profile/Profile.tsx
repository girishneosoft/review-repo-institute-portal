"use client"
import CustomButton from "@/components/CustomButton";
import MuiPanel from "@/components/MuiPanel";
import PortraitIcon from '@mui/icons-material/Portrait';
import UserActivity from "@/components/User/UserActivity";
import { axiosInstance } from "@/utils/axiosInstance";
import { styled, Paper, Box, Typography, Grid } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { InstituteProps, PostProps } from "@/types";
import CircularProgress from '@mui/material/CircularProgress';

const Wrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    gap: 15
}))

const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "5px 7px",
    color: theme.palette.primary.main
}))

interface ProfileProps {
    institute: InstituteProps;
    posts: PostProps[];
}

export default function Profile({ institute, posts }: ProfileProps) {

    return (
        <>
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <UserActivity posts={posts} />
                    </Grid>
                    <Grid item xs={4}>
                        <Paper >
                            <Title variant="subtitle2" >
                                <PortraitIcon /> About
                            </Title>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, background: "#fff", p: 1, pt: 2 }}>
                                <Wrapper>
                                    <Typography variant="subtitle2" ><AssignmentIcon /></Typography>
                                    <Typography variant="subtitle2" >{institute.instituteName}</Typography>
                                </Wrapper>
                                <Wrapper>
                                    <Typography variant="subtitle2" ><CenterFocusStrongIcon /></Typography>
                                    <Typography variant="subtitle2" >{institute.userName}</Typography>
                                </Wrapper>
                                <Wrapper>
                                    <Typography variant="subtitle2"><MailOutlineIcon /> </Typography>
                                    <Typography variant="subtitle2" >{institute.email}</Typography>
                                </Wrapper>
                                <Wrapper>
                                    <Typography variant="subtitle2"><PhoneIcon /></Typography>
                                    <Typography variant="subtitle2" >{institute.mobile}</Typography>
                                </Wrapper>
                                <Wrapper>
                                    <Typography variant="subtitle2"><LanguageIcon /></Typography>
                                    <Typography variant="subtitle2" >{institute?.institute?.website}</Typography>
                                </Wrapper>
                                <Wrapper>
                                    <Typography variant="subtitle2"><LocationOnOutlinedIcon /></Typography>
                                    <Typography variant="subtitle2" >{institute.address}</Typography>
                                </Wrapper>
                                <Wrapper>
                                    <Typography variant="subtitle2"><LibraryBooksOutlinedIcon /></Typography>
                                    <Typography variant="subtitle2" >Broacher <FileDownloadOutlinedIcon sx={{ fontSize: "1rem" }} /></Typography>
                                </Wrapper>
                                <Wrapper>
                                    <Typography variant="subtitle2"><InfoOutlinedIcon /> </Typography>
                                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}> {institute?.institute?.aboutUs} </Typography>
                                </Wrapper>

                                <Typography variant="subtitle2">Rating</Typography>
                                <Paper elevation={2} sx={{ p: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            <CircularProgressWithLabel
                                                value={institute?.institute?.placementRating}
                                                label="Placement"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            <CircularProgressWithLabel
                                                value={institute?.institute?.placementRating}
                                                label="Staff"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            <CircularProgressWithLabel
                                                value={institute?.institute?.placementRating}
                                                label="Teaching"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                            <CircularProgressWithLabel
                                                value={institute?.institute?.placementRating}
                                                label="Environment"
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

function CircularProgressWithLabel({ value, label }: { value: number, label: string }) {
    const percentage = (value / 5) * 100;
    return (
        <>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress size={60} variant="determinate" value={percentage} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                    >{value}</Typography>
                </Box>
            </Box>

            <Typography
                variant="caption"
                component="div"
                color="text.secondary"
            >{label}</Typography>
        </>
    );
}
