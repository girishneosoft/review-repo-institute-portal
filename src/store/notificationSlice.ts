import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './index';

interface Notification {
    date: string;
    requests: {
        id: number;
        "senderUserId": number;
        "receiverUserId": number;
        "senderName": string;
        "senderUserName": string;
        "createdAt": string;
        "sender": {
            "avtarUrl": string
        };
        status?: string;
    }[]
}
interface SliceInterface {
    initialLoading: boolean;
    notifications: Notification[];
    activities: any[]
}

const defaultValues: SliceInterface = {
    initialLoading: false,
    notifications: [],
    activities: [],
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: defaultValues,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.initialLoading = false;
        },
        setActivities: (state, action) => {
            state.activities = action.payload;
            state.initialLoading = false;
        },
    },
})

export const { setNotifications, setActivities } = notificationSlice.actions

export const notificationState = (state: RootState) => state.notification;

export default notificationSlice.reducer