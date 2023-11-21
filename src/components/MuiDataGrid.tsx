"use client"
import React from 'react';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { Box, Paper } from "@mui/material"

export default function MuiDataGrid({ sx, ...rest }: DataGridProps) {
    return (
        <>
            <DataGrid
                autoHeight={true}
                disableColumnFilter
                sx={{
                    border: 0,
                    '& .MuiDataGrid-columnHeadersInner': {
                        backgroundColor: "#F0F3FF",
                        color: (theme) => theme.palette.primary.main, // Set the text color for the header
                        // borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`, // Use primary color for border
                    },
                    "& .MuiDataGrid-cell": {
                        outline: "none !important"
                    },
                    ...sx
                }}
                {...rest}
                componentsProps={{
                    pagination: {
                        rowsPerPageOptions: [5, 10, 25, 50, 100],
                    },
                }}
            />
        </>
    );
}