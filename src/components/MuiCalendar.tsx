"use client"

import { Box, styled, Typography } from "@mui/material";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';

const StyledCalendar: any = styled(Calendar)(({ theme }) => ({
    "& .rbc-row-segment": {
        fontSize: '10px',
    },
    "& .rbc-date-cell": {
        fontSize: '12px',
    },
    "& .rbc-event": {
        backgroundColor: theme.palette.primary.main,
        borderRadius: "3px"
    }
}));

const CalendarHeaderWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    background: "#F0F3FF",
    alignItems: "center",
    padding: "4px"
}));

const localizer = momentLocalizer(moment)

interface MuiCalendarProps {
    events?: any[];
    sx?: any;
    dayPropGetter?: any;
    onSelectSlot?: any;
    selectable?: boolean;
    rest?: Record<string, any>;
}

export default function MuiCalendar({ events, sx = {}, ...rest }: MuiCalendarProps) {
    const CustomToolbar = ({ label, onNavigate }: any) => (
        <CalendarHeaderWrapper sx={{ display: "flex", justifyContent: "space-between", background: "#F0F3FF" }}>
            <IconButton size="small" onClick={() => onNavigate('PREV')} color="primary">
                <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ color: "primary.main" }}>{label}</Typography>
            <IconButton size="small" onClick={() => onNavigate('NEXT')} color="primary">
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
        </CalendarHeaderWrapper>
    );

    return (
        <>
            <StyledCalendar
                localizer={localizer}
                events={events}
                views={['month']}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 350, ...sx }}
                // components={{
                //     toolbar: CustomToolbar, // Use the custom toolbar component
                // }}
                {...rest}
            />

        </>
    )
}