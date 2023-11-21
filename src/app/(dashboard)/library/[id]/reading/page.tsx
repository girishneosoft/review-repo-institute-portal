import { BookProps } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance"
import { Paper, Grid, Avatar, Typography, Box, styled, Button, Container } from "@mui/material";
import PDFViewer from "./../PDFViewer";

async function getBookDetails(id: number | string) {
    const res = await axiosInstance(`/api/book/${id}`)

    return res.data;
}

export default async function Page({ params }: any) {
    const book: BookProps = await getBookDetails(params.id);

    return (
        <>
            <Paper sx={{ p: 5 }} elevation={0} >
                <PDFViewer book={book} />
            </Paper>
        </>
    )
}