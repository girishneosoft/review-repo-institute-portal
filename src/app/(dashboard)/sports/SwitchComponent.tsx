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
            path: "/sports/team-members"
        }, {
            key: "competition",
            name: "Competition",
            path: "/sports/competitions"
        }, {
            key: "accessories",
            name: "Accessories",
            path: "/sports/accessories"
        },
        {
            key: "opportunities",
            name: "Opportunities",
            path: "/sports/opportunities"
        },
        {
            key: "exhibition",
            name: "Exhibitions",
            path: "/sports/exhibitions"
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