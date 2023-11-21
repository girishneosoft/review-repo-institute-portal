import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './index';

interface User {
    initialLoading: boolean;
    currentUser: {
        id: number;
        avtarUrl: string,
        name: string,
    }
    user: {
        id: number;
        avtarUrl: string,
        name: string,
    }
}

const defaultValues: User = {
    initialLoading: false,
    currentUser: {
        id: 0,
        avtarUrl: '',
        name: '',
    },
    user: {
        id: 0,
        avtarUrl: '',
        name: '',
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: defaultValues,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            state.initialLoading = false;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.initialLoading = false;
        },
    },
})

export const { setCurrentUser, setUser } = userSlice.actions

export const userState = (state: RootState) => state.user;

export default userSlice.reducer