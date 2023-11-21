
import * as React from 'react';
import UserProfile from '.';
import { axiosInstance } from '@/utils/axiosInstance';

interface LayoutProps {
    params: {
        userId: string
    }
}

async function getTeacherDetails(userId: string) {
    const res = await axiosInstance.get(`/api/teacher/get/${userId}`)
    return res.data;
}

async function getTeacherPosts(userId: string) {
    const res = await axiosInstance.post(`/api/teacher/${userId}/posts`, {
        "offset": 0,
        "limit": 1000
    })
    return res.data;
}

export default async function Page({ params }: LayoutProps) {
    const [user, posts] = await Promise.all([getTeacherDetails(params.userId), getTeacherPosts(params.userId)])

    return (
        <>
            <UserProfile user={user} posts={posts} params={params} />
        </>
    )
}