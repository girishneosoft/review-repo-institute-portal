import React, { useState, useEffect } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { toastMessage } from '@/utils/toastify';
import { axiosInstance } from '@/utils/axiosInstance';
import "react-dropzone/examples/theme.css";

interface UploadImageProps {
    callApi: any
}

export default function UploadImage({ callApi }: UploadImageProps) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
        }
    });
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (acceptedFiles[0]) {
            const formData = new FormData();
            formData.append("image", acceptedFiles[0])

            axiosInstance.post("/api/institute/gallery/upload_image", formData)
                .then((res) => {
                    toastMessage(res.data.message, "s")
                    setIsLoading(false)
                    callApi();
                }).catch(() => {
                    setIsLoading(false)
                })
        }
    }, [acceptedFiles])

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/institute/gallery/upload_image", data)
            .then((res) => {
                toastMessage(res.data.message, "s")
                setIsLoading(false)
                callApi();
            }).catch(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            <Box sx={{ p: 1, mt: 2 }}>
                <Box maxWidth={"md"} sx={{ margin: "auto" }} >
                    <Typography sx={{ mb: 1 }}>File Upload</Typography>
                    <Box component="div" {...getRootProps({ className: 'dropzone' })} sx={{ height: 150, display: "flex", justifyContent: "center" }}>
                        <input {...getInputProps()} />
                        <CloudUploadOutlinedIcon fontSize="large" />
                        <p>Drop here or click to upload</p>
                    </Box>
                </Box>
            </Box>
        </ >
    );
}