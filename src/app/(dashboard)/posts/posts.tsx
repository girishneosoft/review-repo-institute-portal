"use client"

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { PostProps } from './types';
import { axiosInstance } from '@/utils/axiosInstance';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Post from './Post';
import { toastMessage } from '@/utils/toastify';
import { Box } from '@mui/material';

// eslint-disable-next-line react/display-name
const Posts = forwardRef((_props, ref) => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<any>(null);
    const pageRef = useRef<number>(1);
    const hasMoreRef = useRef<boolean>(true);
    const apiCallingRef = useRef<boolean>(true);

    const loadPosts = (initialLoad = false) => {
        setIsLoading(true);
        apiCallingRef.current = true;
        const offset = initialLoad ? 0 : (pageRef.current - 1)
        axiosInstance.get(`/api/home/posts`, {
            params: { offset: offset, limit: 5 }
        }).then((response) => {
            const newPosts = response.data;
            if (newPosts.length === 0) {
                hasMoreRef.current = false
            } else {
                if (initialLoad) {
                    setPosts(newPosts);
                } else {
                    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                }
                console.log(pageRef.current, "before")
                pageRef.current = initialLoad ? 1 : pageRef.current + 1;
            }
            setIsLoading(false);
            apiCallingRef.current = false;
        });
    };

    useImperativeHandle(ref, () => ({
        refreshPost() {
            loadPosts(true)
        }
    }));

    useEffect(() => {
        loadPosts();
    }, []);

    const onLikeOrUnLikePost = (post: PostProps, index: number) => {
        const _posts = [...posts];
        _posts[index]['isLiked'] = !post.isLiked;
        _posts[index]['likes'] = !post.isLiked ? post.likes - 1 : post.likes + 1;
        setPosts(_posts);

        axiosInstance.post(`/api/post/like_or_unlike/${post.id}`)
    }

    const onArchivePost = (id: number) => {
        const _posts = posts.filter((o) => o.id !== id)
        setPosts(_posts);
        axiosInstance.delete(`/api/post/${id}`).then((res) => {
            toastMessage(res.data.message, "s")
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        const threshold = 50;

        if (scrollHeight - scrollTop - clientHeight < threshold && hasMoreRef.current && !apiCallingRef.current) {
            console.log("call api")
            loadPosts();
        }
    }, [isLoading]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <>
            <Box ref={containerRef} sx={{ height: "calc(100vh - 92px)", overflowY: 'scroll' }}>
                {posts.map((item: PostProps, index: number) => (
                    <Post
                        key={Math.random()}
                        post={item}
                        index={index}
                        isLoading={isLoading}
                        onLikeOrUnLikePost={onLikeOrUnLikePost}
                        onArchivePost={onArchivePost}
                    />
                ))}

                {isLoading && [0, 1].map((item) => (
                    <Post
                        key={item}
                        post={{} as any}
                        isLoading={isLoading}
                        index={item}
                        onLikeOrUnLikePost={undefined}
                        onArchivePost={undefined}
                    />))
                }
            </Box>
        </>
    )
})

export default Posts;