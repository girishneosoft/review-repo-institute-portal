"use client"
import CustomButton from "@/components/CustomButton";
import { Box } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function SwitchComponent({ activePill }: { activePill: string }) {
    const pills = [
        {
            key: "member",
            name: "Team Member",
            path: "/transport/team-members"
        }, {
            key: "fees",
            name: "Fees",
            path: "/transport/fees"
        }, {
            key: "details",
            name: "Details",
            path: "/transport/details"
        }
    ]

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mb: 2 }}>
                {pills.map((item) => (
                    <CustomButton
                        LinkComponent={Link}
                        href={item.path}
                        key={item.key}
                        active={activePill === item.key}
                    >{item.name}</CustomButton>
                ))}
            </Box >
        </>
    )
}