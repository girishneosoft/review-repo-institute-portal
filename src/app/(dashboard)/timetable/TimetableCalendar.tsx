"use client"

import { Box, styled, Typography } from "@mui/material";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';

const CalendarHeaderWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    background: "#F0F3FF",
    alignItems: "center",
}));

const localizer = momentLocalizer(moment)


export default function TimetableCalendar() {
    const CustomToolbar = ({ label, onNavigate }: any) => (
        <CalendarHeaderWrapper sx={{ display: "flex", justifyContent: "space-between", background: "#F0F3FF" }}>
            <IconButton onClick={() => onNavigate('PREV')} color="primary">
                <ArrowBackIosIcon />
            </IconButton>
            <Typography color="primary">{label}</Typography>
            <IconButton onClick={() => onNavigate('NEXT')} color="primary">
                <ArrowForwardIosIcon />
            </IconButton>
        </CalendarHeaderWrapper>
    );

    return (
        <>
            <Calendar
                localizer={localizer}
                events={[]}
                views={['month']}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 350 }}
                components={{
                    toolbar: CustomToolbar, // Use the custom toolbar component
                }}
            />

        </>
    )
}