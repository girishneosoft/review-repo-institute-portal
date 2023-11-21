"use client"
import CustomButton from "@/components/CustomButton";
import { Box } from "@mui/material";
import Link from "next/link";

export default function SwitchComponent({ activePill }: { activePill: string }) {
    const pills = [
        {
            key: "member",
            name: "Team Member",
            path: "/canteen/team-members"
        }, {
            key: "menu",
            name: "Menu",
            path: "/canteen/menu"
        }, {
            key: "details",
            name: "Details",
            path: "/canteen/details"
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