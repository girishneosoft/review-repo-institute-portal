"use client"

import React from 'react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import CustomButton from '@/components/CustomButton';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Link from 'next/link';

interface SwitchProfileActivityProps {
    hrefPrimary: string;
    hrefSecondary: string;
    activePrimary: boolean;
    activeSecondary: boolean;
}

export default function SwitchProfileActivity({
    hrefPrimary,
    hrefSecondary,
    activePrimary,
    activeSecondary
}: SwitchProfileActivityProps) {
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 1 }}>
                <Button
                    variant='outlined'
                    size="small"
                    startIcon={<ArrowBackIosNewOutlinedIcon />}
                    LinkComponent={Link}
                    href="/staff"
                >Back</Button>
                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, background: "#fff" }}>
                    <CustomButton
                        LinkComponent={Link}
                        href={hrefPrimary}
                        active={activePrimary}
                        size="small"
                        sx={{ minWidth: 150 }}
                    >Profile</CustomButton>

                    <CustomButton
                        LinkComponent={Link}
                        href={hrefSecondary}
                        active={activeSecondary}
                        size="small"
                        sx={{ minWidth: 150 }}
                    >Class Activity</CustomButton>
                </Box>
            </Box >
        </>
    )
}
