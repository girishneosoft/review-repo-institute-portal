"use client"
import CustomButton from "@/components/CustomButton";
import { Box } from "@mui/material";
import Link from "next/link";
import { useState } from "react";

interface SwitchComponentProps {
    categories: any[];
    activePill: string;
}
export default function SwitchComponent({ categories: categories, activePill }: SwitchComponentProps) {

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mb: 2 }}>
                {categories.map((item) => (
                    <CustomButton
                        LinkComponent={Link}
                        href={`/library?c=${item.keyName}`}
                        key={item.keyName}
                        active={activePill === item.keyName}
                    >{item.name}</CustomButton>
                ))}
            </Box >
        </>
    )
}