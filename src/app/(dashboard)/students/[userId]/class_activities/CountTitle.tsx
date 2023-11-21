"use client"
import * as React from 'react';
import { Paper, Typography } from '@mui/material';

interface CountTitleProps {
    title: string,
    value: string | number
    valueColor: string
}

export default function CountTitle({ title, value, valueColor }: CountTitleProps) {
    return (
        <>
            <Paper elevation={2} sx={{ p: 1.5, textAlign: "center", minWidth: "150px" }}>
                <Typography variant='subtitle2' sx={{ color: "text.secondary" }} >{title}</Typography>
                <Typography component={"b"} variant='subtitle2' sx={{ color: valueColor }} >{value}</Typography>
            </Paper>
        </>
    )
}