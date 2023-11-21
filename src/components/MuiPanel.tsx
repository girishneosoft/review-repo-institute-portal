"use client"

import { Typography, Box, styled, Paper, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "5px 7px",
    color: theme.palette.primary.main
}))

interface MuiPanelProps {
    title: string | React.ReactNode;
    children: React.ReactNode
    onArchive?: any;
    sx?: any;
    elevation?: number;
}

export default function MuiPanel({ title, children, onArchive, sx = {}, elevation = 1, }: MuiPanelProps) {
    return (
        <Paper sx={{ mt: 2, ...sx }} elevation={elevation}>
            <Title variant="subtitle2" >
                <span >{title}</span>
                {onArchive && <IconButton onClick={onArchive} size="small" sx={{ color: "error.light" }}>
                    <DeleteIcon />
                </IconButton>}
            </Title>
            <Box sx={{ p: 1 }}>
                <Typography variant="body2" > {children}</Typography>
            </Box>
        </Paper>
    )
}