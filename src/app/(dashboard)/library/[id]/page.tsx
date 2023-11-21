import { BookProps } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance"
import { Paper, Grid, Avatar, Typography, Box, styled, Button, Container } from "@mui/material";
import Link from "next/link";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

async function getBookDetails(id: number | string) {
    const res = await axiosInstance(`/api/book/${id}`)

    return res.data;
}

export default async function Page({ params }: any) {
    const book: BookProps = await getBookDetails(params.id);

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 1 }}>
                <Button
                    variant='outlined'
                    size="small"
                    startIcon={<ArrowBackIosNewOutlinedIcon />}
                    LinkComponent={Link}
                    href="/library"
                >Back</Button>
            </Box >
            <Paper sx={{ p: 5, height: "100%" }} elevation={0} >

                <Grid container spacing={5}>
                    <Grid item md={4} >
                        <Avatar
                            variant="rounded"
                            src={book?.thumbnailUrl}
                            sx={{ height: "400px", width: "100%" }}
                        >{book.name}</Avatar>
                    </Grid>
                    <Grid item md={6} >
                        <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                            <Typography color="text.secondary">Book Name:</Typography>
                            <Typography>{book.name}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                            <Typography color="text.secondary">Writer Name:</Typography>
                            <Typography>{book.writerName}</Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="small"
                            LinkComponent={Link}
                            target="_blank"
                            href={book?.bookUrl ? book?.bookUrl : `/library/${params.id}/reading`}
                        >Start Reading</Button>
                    </Grid>
                </Grid>


            </Paper>
        </>
    )
}