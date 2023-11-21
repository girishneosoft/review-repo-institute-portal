export interface PostProps {
    id: number,
    title: string,
    desc: string,
    createdAt: string,
    comments: number,
    likes: number,
    isLiked: boolean,
    isMyPost: boolean,
    photos: [
        {
            pathUrl: string
        }
    ],
    user: {
        avtarUrl: string,
        id: number,
        userName: string,
        email: string,
        name: string
    }
}