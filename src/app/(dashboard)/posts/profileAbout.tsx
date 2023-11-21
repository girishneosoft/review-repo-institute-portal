"use client"

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';

const Wrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "flex-start",
    gap: 1
}))


export default function Page() {
    return (
        <>
            <Box sx={{ marginTop: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <Wrapper>
                    <Typography variant="body2" >Mobile number:</Typography>
                    <Typography variant="body2" color="text.secondary">9803232152</Typography>
                </Wrapper>
                <Wrapper>
                    <Typography variant="body2" >Email Id:</Typography>
                    <Typography variant="body2" color="text.secondary">bagmorgirish@gmail.com</Typography>
                </Wrapper>
                <Wrapper>
                    <Typography variant="body2">Birth Date:</Typography>
                    <Typography variant="body2" color="text.secondary" >03 Oct 1995</Typography>
                </Wrapper>
                <Wrapper>
                    <Typography variant="body2">Blood group:</Typography>
                    <Typography variant="body2" color="text.secondary">A+</Typography>
                </Wrapper>
                <Wrapper>
                    <Typography variant="body2">Gender:</Typography>
                    <Typography variant="body2" color="text.secondary">Male</Typography>
                </Wrapper>
                <Wrapper>
                    <Typography variant="body2">Skill:</Typography>
                    <Typography variant="body2" color="text.secondary">9803232152</Typography>
                </Wrapper>
                <Wrapper>
                    <Typography variant="body2">Hobby:</Typography>
                    <Typography variant="body2" color="text.secondary">Cricket</Typography>
                </Wrapper>
                <Wrapper>
                    <Typography variant="body2">Achievement:</Typography>
                    <Typography variant="body2" color="text.secondary">Dk</Typography>
                </Wrapper>
            </Box>

        </>
    )
}
