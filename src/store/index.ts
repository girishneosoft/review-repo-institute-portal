import { configureStore } from '@reduxjs/toolkit'
import { postSlice } from "./postSlice";
import { notificationSlice } from "./notificationSlice";
import { userSlice } from './userSlice';

export const store = configureStore({
    reducer: {
        post: postSlice.reducer,
        notification: notificationSlice.reducer,
        user: userSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>