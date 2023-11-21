"use client"
import React, { useState, useEffect } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Box, Typography, Button, Paper, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { toastMessage } from '@/utils/toastify';
import { axiosInstance } from '@/utils/axiosInstance';
import "react-dropzone/examples/theme.css";
import UploadedFilePreview from '@/components/UploadedFilePreview';

interface UploadImageProps {
    open: boolean;
    handleClose: any;
}

export default function UploadImage({ open, handleClose }: UploadImageProps) {
    const [files, setFiles] = useState<any>([]);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/jpg': [],
        },
        onDrop: acceptedFiles => {
            setFiles([
                ...files,
                { preview: acceptedFiles[0] }
            ]);
        }
    });
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (acceptedFiles[0]) {
            const formData = new FormData();
            formData.append("image", acceptedFiles[0])

            axiosInstance.post("/api/culture_photo/upload_image", formData)
                .then((res) => {
                    toastMessage(res.data.message, "s")
                    setIsLoading(false)
                }).catch(() => {
                    setIsLoading(false)
                })
        }
    }, [acceptedFiles])

    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Upload Photo
                </DialogTitle>
                <Paper sx={{ padding: 2, height: "100%" }} elevation={0} >
                    <Box sx={{ p: 1 }}>
                        <Box maxWidth={"md"} sx={{ margin: "auto" }} >
                            <Typography sx={{ mb: 1 }}>File Upload</Typography>
                            <Box component="div" {...getRootProps({ className: 'dropzone' })} sx={{ height: 150, display: "flex", justifyContent: "center" }}>
                                <input {...getInputProps()} />
                                <CloudUploadOutlinedIcon fontSize="large" />
                                <p>Drop here or click to upload</p>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ p: 1, mt: 1 }}>
                        {files.map((item: any) => (
                            <UploadedFilePreview
                                key={item.preview}
                                uploadedImage={URL.createObjectURL(item.preview)}
                            />
                        ))}

                    </Box>
                </Paper>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}