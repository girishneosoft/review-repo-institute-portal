"use client"
import { axiosInstance } from "@/utils/axiosInstance";
import SwitchComponent from "./SwitchComponent";
import { Avatar, Box, Grid, Paper, Typography, styled } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BookProps } from "@/types";
import Link from "next/link";

interface LibraryProps {
    categories: any[],
    searchParams: any
}

const BookCover = styled(Avatar)({
    height: 180,
    width: 145,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    display: 'flex',
    // alignItems: 'center',
    flexDirection: "column",
    // justifyContent: 'center',
    transition: 'width 0.3s, height 0.3s',
    overflow: "hidden",
    '&:hover': {
        width: 160,
        height: 210,
        zIndex: 100,
    },
})

const BookWrapper: any = styled(Paper)({
    position: "absolute",
    width: "fit-content",
    // height: 210,
    // color: '#fff',
    display: 'flex',
    // alignItems: 'center',
    flexDirection: "column",
    // justifyContent: 'center',
    // transition: 'width 0.3s, height 0.3s',
    // overflow: "hidden",
    '&:hover': {
        position: 'relative',
        zIndex: 100,
    },
})

export default function Library({ searchParams, categories }: LibraryProps) {
    const [books, setBooks] = useState<BookProps[]>([]);
    const [recentReadBooks, setRecentReadBooks] = useState<BookProps[]>([]);

    const categoryId = useMemo(() => {
        const _keyName = searchParams?.c ?? "institute";
        return categories.find((c) => _keyName === c.keyName)?.categoryId;
    }, [searchParams?.c, categories])

    const getBookList = () => {
        axiosInstance.get("/api/books", {
            params: { categoryId: categoryId }
        }).then((res) => {
            setBooks(res.data)
        })
    }

    const getRecentlyBookList = () => {
        axiosInstance.get("/api/books", {
            params: { onlyRecentBook: true }
        }).then((res) => {
            setRecentReadBooks(res.data)
        })
    }

    useEffect(() => {
        getRecentlyBookList()
        getBookList();
    }, [categoryId])

    return (
        <>
            <SwitchComponent activePill={searchParams?.c ?? "institute"} categories={categories} />
            <Paper component="div" sx={{ p: 1, height: "100%" }} elevation={0} >
                {recentReadBooks.length > 0 && <>
                    <Typography color="primary.main" sx={{ mb: 1 }}>Recently Read</Typography>
                    <Grid container spacing={1} sx={{ mb: 1 }} >
                        {recentReadBooks.map((item) => (
                            <Grid item key={item.id} md={12 / 7} sm={4} xs={12}>
                                <Book item={item} />
                            </Grid>
                        ))}
                    </Grid>
                </>}

                <Typography color="primary.main" sx={{ mb: 1 }}>Books</Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {books.map((item) => (
                        <Grid item key={item.id} md={12 / 7} sm={4} >
                            <Book item={item} />
                        </Grid>
                    ))}
                </Box>
            </Paper>
        </>
    )
}

const Book = ({ item }: { item: BookProps }) => {
    return (
        <>
            <Box sx={{ height: 220, width: 140, position: "relative" }}>
                <BookWrapper component={Link} href={`/library/${item.id}`}>
                    <BookCover
                        variant="rounded"
                        src={item.thumbnailUrl}
                        alt={item.name}
                    >{item.name}</BookCover>
                    <Typography sx={{ textAlign: "center", p: 0.5, color: "#000" }}>{item.name}</Typography>
                </BookWrapper>
            </Box>
        </>
    )
}