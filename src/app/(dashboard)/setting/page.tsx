"use client"
import { Typography, Box, Paper, Button, Grid, styled, Switch } from "@mui/material";
import Link from "next/link";

const Wrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
}));

const label = { inputProps: { 'aria-label': 'Switch' } };

export default function Settings() {
    return (
        <>
            <Paper sx={{ p: 2, height: "100%" }}>
                <Grid container spacing={2} >
                    <Grid item md={6} sm={12} xs={12}>
                        <Typography sx={{ mb: 2 }}>Settings</Typography>

                        <Wrapper>
                            <Typography variant="subtitle2" color="text.secondary">Department/Faculty</Typography>
                            <Button size="small" variant="outlined">Change</Button>
                        </Wrapper>

                        <Wrapper>
                            <Typography variant="subtitle2" color="text.secondary">Branch/Stream</Typography>
                            <Button size="small" variant="outlined">Change</Button>
                        </Wrapper>

                        <Wrapper>
                            <Typography variant="subtitle2" color="text.secondary">Class</Typography>
                            <Button component={Link} href="/classes" size="small" variant="outlined">Change</Button>
                        </Wrapper>

                        <Wrapper>
                            <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                            <Button href="/edit_profile" component={Link} size="small" variant="outlined">Change</Button>
                        </Wrapper>

                        <Wrapper>
                            <Typography variant="subtitle2" color="text.secondary">Password</Typography>
                            <Button href="/setting/change-password" component={Link} size="small" variant="outlined">Change</Button>
                        </Wrapper>

                        <Wrapper>
                            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                            <Button href="/edit_profile" component={Link} size="small" variant="outlined">Change</Button>
                        </Wrapper>

                        <Wrapper>
                            <Typography variant="subtitle2" color="text.secondary">Connection request automatically accept</Typography>
                            <Switch {...label} defaultChecked />
                        </Wrapper>

                        <Wrapper>
                            <Typography variant="subtitle2" color="text.secondary">Message notification</Typography>
                            <Switch {...label} defaultChecked />
                        </Wrapper>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}