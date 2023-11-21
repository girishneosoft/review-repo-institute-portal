import React, { useEffect, useState } from 'react';
import { IconButton, Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, DialogContent } from '@mui/material';
import { axiosInstance } from '@/utils/axiosInstance';
import moment from 'moment';
import { PostProps } from '@/types';


interface ReadDialogProps {
    open: boolean;
    postId: number | string;
    handleClose: (status?: boolean) => void;
}

export default function ReadDialog({ open, postId, handleClose }: ReadDialogProps) {
    const [post, setPost] = useState({ title: "", desc: "" });
    const [isLoading, setIsLoading] = useState(false);

    const getPost = () => {
        setIsLoading(true)
        axiosInstance.get(`/api/post/${postId}`).then((res) => {
            setPost(res.data);
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getPost()
    }, [postId])

    return (
        <div>
            <Dialog
                fullWidth={true}
                open={open}
                maxWidth={"xs"}
                onClose={() => handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ display: "flex", justifyContent: "space-between" }}>
                    {isLoading && <Skeleton height={15} width={"60%"} />}
                    {!isLoading && <Typography>{post.title}</Typography>}
                    <IconButton aria-label="close" color="error" size="small"
                        sx={{ background: "#F0F3FF" }}
                        onClick={() => handleClose(false)}
                    >
                        <CloseIcon fontSize={"small"} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ position: "relative" }}>
                    <Box>
                        {isLoading && <>
                            <Skeleton height={15} />
                            <Skeleton height={15} width={"80%"} />
                            <Skeleton height={15} width={"60%"} />
                        </>
                        }
                        {!isLoading && <Typography variant="body2" color="text.secondary">{post.desc}</Typography>}
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
}
