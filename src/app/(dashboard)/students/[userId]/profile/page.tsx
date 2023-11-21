
import * as React from 'react';
import UserProfile from '.';
import { axiosInstance } from '@/utils/axiosInstance';

interface ProfileProps {
    params: {
        userId: string
    }
}

async function getStudentDetails(userId: string) {
    const res = await axiosInstance.get(`/api/student/get/${userId}`)
    return res.data;
}

async function getStudentPosts(userId: string) {
    const res = await axiosInstance.post(`/api/student/${userId}/posts`, {
        "offset": 0,
        "limit": 1000
    })
    return res.data;
}

export default async function Page({ params }: ProfileProps) {
    const [user, posts] = await Promise.all([getStudentDetails(params.userId), getStudentPosts(params.userId)])

    return (
        <>
            <UserProfile user={user} posts={posts} />
        </>
    )
}