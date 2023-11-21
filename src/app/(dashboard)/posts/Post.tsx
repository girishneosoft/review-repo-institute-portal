"use client"

import React, { useState, useEffect } from 'react';
import { Box, ListItemIcon, ListItemText } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import Skeleton from '@mui/material/Skeleton';
import ShareIcon from '@mui/icons-material/Share';
import moment from 'moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import Chip from '@mui/material/Chip';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { PostProps } from './types';
import { styled } from '@mui/material';
import { axiosInstance } from '@/utils/axiosInstance';
import CommentDialog from './CommentDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import ReadDialog from './ReadDialog';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { toastMessage } from '@/utils/toastify';

const IconWrapper = styled(Chip)(({ theme }) => ({
    borderRadius: "4px",
    cursor: "pointer"
}))

interface PostComponentProps {
    post: PostProps;
    index: number;
    isLoading: boolean;
    onLikeOrUnLikePost: any;
    onArchivePost: any
}

export default function Post({ post, index, isLoading, onLikeOrUnLikePost, onArchivePost }: PostComponentProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [openCommentBox, setOpenCommentBox] = React.useState(false);
    const [openReadBox, setOpenReadBox] = React.useState(false);
    const [selectedPostId, setSelectedPostId] = React.useState(0);
    const [commentCount, setCommentCount] = React.useState(0);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setCommentCount(post?.comments)
    }, [post])

    const getCommentCount = (count: number) => {
        setCommentCount(count);
    }

    return (
        <>
            <Card key={post.title} sx={{ minWidth: 345, marginBottom: 2, boxShadow: 0 }}>
                <CardHeader
                    avatar={
                        isLoading ? <Skeleton animation="wave" variant="circular" width={40} height={40} />
                            : <Avatar src={post?.user?.avtarUrl} sx={{ bgcolor: red[500] }} />
                    }
                    action={
                        <>{post?.isMyPost ?
                            <>
                                <IconButton aria-label="settings" onClick={handleClick}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={() => {
                                        onArchivePost(post.id, index)
                                        handleClose()
                                    }}>
                                        <ListItemIcon sx={{ color: "error.light" }}>
                                            <DeleteIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Delete" />
                                    </MenuItem>
                                </Menu>
                            </> : ""
                        }</>
                    }
                    title={isLoading ? <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                    /> : post?.user?.name}
                    subheader={isLoading ? <Skeleton animation="wave" height={10} width="40%" />
                        : moment(post?.createdAt).format("DD MMM YYYY")}
                />
                <Box sx={{ borderRadius: "10px", paddingLeft: 2, paddingRight: 2, }}>
                    {isLoading && <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />}
                    {!isLoading && <Carousel
                        showIndicators={post?.photos.length === 1 ? false : true}
                        showThumbs={false}
                        showStatus={false}
                    >
                        {post?.photos.map((photo) => (
                            <CardMedia
                                key={photo?.pathUrl}
                                component="img"
                                height="194"
                                width={"100%"}
                                image={photo?.pathUrl}
                                alt="Paella dish"
                                sx={{ borderRadius: "10px" }}
                            />
                        ))}
                    </Carousel>}
                </Box>

                {!isLoading && <CardActions sx={{ marginTop: 1, paddingLeft: 2 }} >
                    <IconWrapper
                        onClick={() => onLikeOrUnLikePost(post, index)}
                        icon={post.isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                        label={post.likes}
                    />
                    <IconWrapper
                        onClick={() => {
                            setOpenCommentBox(true);
                            setSelectedPostId(post.id)
                        }}
                        icon={<ChatBubbleOutlineOutlinedIcon />}
                        label={commentCount}
                    />
                    <IconWrapper
                        onClick={() => {
                            setOpenReadBox(true);
                            setSelectedPostId(post.id)
                        }}
                        icon={<LibraryBooksOutlinedIcon />} label="Read"
                    />
                    <IconWrapper icon={<ShareIcon />} />
                </CardActions>}
                <CardContent>
                    {isLoading ? (
                        <React.Fragment>
                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" height={10} width="80%" />
                        </React.Fragment>
                    ) :
                        <Typography variant="body2" color="text.secondary">
                            {post?.desc}
                        </Typography>
                    }
                </CardContent>
            </Card>

            {openCommentBox && <CommentDialog
                open={openCommentBox}
                postId={selectedPostId}
                getCommentCount={getCommentCount}
                handleClose={(status) => setOpenCommentBox(false)}
            />}

            {openReadBox && <ReadDialog
                open={openReadBox}
                postId={selectedPostId}
                handleClose={(status) => setOpenReadBox(false)}
            />}
        </>
    )
}
