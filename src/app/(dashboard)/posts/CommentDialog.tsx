import React, { useEffect, useState } from 'react';
import { InputAdornment, CardHeader, Avatar, IconButton, Box, Typography, Skeleton, CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, DialogContent } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { axiosInstance } from '@/utils/axiosInstance';
import moment from 'moment';
import { CommentProps } from '@/types';
import Input from '@/components/InputComponent';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface CommentDialogProps {
    open: boolean;
    postId: number | string;
    getCommentCount: any;
    handleClose: (status?: boolean) => void;
}

export default function CommentDialog({ open, postId, getCommentCount, handleClose }: CommentDialogProps) {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const getCommentList = () => {
        setIsCommentLoading(true)
        axiosInstance.get(`/api/post/comments/${postId}`).then((res) => {
            setComments(res.data);
            setIsCommentLoading(false)
        })
    }

    useEffect(() => {
        getCommentList()
    }, [postId])

    useEffect(() => {
        getCommentCount(comments.length)
    }, [comments])

    const onArchiveComment = (item: CommentProps, index: number) => {
        setIsLoadingDelete(true)
        axiosInstance.delete(`/api/post/comment/${item?.id}`).then((res) => {
            setIsLoadingDelete(false)
            setComments((oldComments) => {
                return oldComments.filter((_, i) => i !== index);
            })
        })
    }

    const onWriteComment = () => {
        if (comment) {
            axiosInstance.post(`/api/post/write_comment/${postId}`, {
                comment
            }).then((res) => {
                getCommentList()
                setComment("")
            })
        }
    }

    return (
        <div>
            <Dialog
                fullWidth={true}
                open={open}
                maxWidth={"sm"}
                onClose={() => handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ p: 1, pl: 2, display: "flex", justifyContent: "space-between" }}>
                    <Typography>Comments</Typography>
                    <IconButton aria-label="close" color="error" size="small"
                        sx={{ background: "#F0F3FF" }}
                        onClick={() => handleClose(false)}
                    >
                        <CloseIcon fontSize={"small"} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, position: "relative" }}>
                    <Box sx={{ overflowY: "scroll", height: "400px", p: 2 }}>
                        {!isCommentLoading && comments.length === 0 &&
                            <Box component="div" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <Typography>No comments</Typography>
                            </Box>
                        }
                        {isCommentLoading && [0, 1].map((item, index) => (
                            <Box key={item}>
                                <CardHeader
                                    size="small"
                                    sx={{ p: 0, mb: 2 }}
                                    avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                                    title={<Skeleton animation="wave" height={15} width="80%" />}
                                    subheader={<Skeleton animation="wave" height={15} width="40%" />}
                                />
                            </Box>
                        ))}

                        {!isCommentLoading && comments.map((item, index) => (
                            <Box key={item.id}>
                                <CardHeader
                                    size="small"
                                    sx={{ p: 0, mb: 2, alignItems: "flex-start" }}
                                    avatar={<Avatar src={item?.user?.avtarUrl} />}
                                    action={
                                        <>
                                            {item?.isMyComment ? <IconButton onClick={() => onArchiveComment(item, index)} aria-label="settings" color="error" size="small">
                                                {isLoadingDelete ? <CircularProgress color="primary" size={"small"} /> : <DeleteOutlineIcon fontSize="small" />}
                                            </IconButton> : ""}
                                        </>
                                    }
                                    title={<>
                                        {item?.name} <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                            {moment(item.createdAt).format("DD MMM YYYY")}
                                        </Typography>
                                    </>
                                    }
                                    subheader={item?.comment}
                                />
                            </Box>
                        ))}
                    </Box>

                    <Input
                        sx={{ p: 2 }}
                        value={comment}
                        placeholder='Write comment here'
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                onWriteComment()
                            }
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton aria-label="send" onClick={onWriteComment}>
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>,
                        }}
                    />

                </DialogContent>
            </Dialog>
        </div >
    );
}
