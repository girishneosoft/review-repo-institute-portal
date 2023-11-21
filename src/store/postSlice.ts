import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './index';

const defaultValues = {
    initialLoading: false,
    posts: [],
    openSharePostPopUp: false,
}

export const postSlice = createSlice({
    name: 'post',
    initialState: defaultValues,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
            state.initialLoading = false;
        },
        setOpenSharePostPopUp: (state, action) => {
            state.openSharePostPopUp = action.payload;
        },
    },
})

export const { setPosts, setOpenSharePostPopUp } = postSlice.actions

export const PostState = (state: RootState) => state.post;

export default postSlice.reducer