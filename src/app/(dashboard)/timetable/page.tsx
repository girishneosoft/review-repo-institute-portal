"use client"
import SelectDropdown from "@/components/SelectDropdown";
import { FacultiesProps, InstituteClassProps, InstituteFacultiesProps, InstituteStreamProps, TimeTableProps } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import { Box, MenuItem, Button, Typography, styled, Avatar } from "@mui/material";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Grid, Paper } from '@mui/material';
import CustomButton from "@/components/CustomButton";
import Link from "next/link";
import MuiCalendar from "@/components/MuiCalendar";
import moment from "moment";
import MuiPanel from "@/components/MuiPanel";
import useConfirmation from "@/hooks/useConfirmation";
import Loader from "@/components/Loader";

const TitleWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "5px 7px",
    color: theme.palette.primary.main
}))

export default function Page() {
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [streams, setStreams] = useState<InstituteStreamProps[]>([]);
    const [classes, setClasses] = useState<InstituteClassProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [filter, setFilter] = useState({
        facultyId: 0,
        streamId: 0,
        classId: 0,
        date: moment(),
    })

    const [timeTableSchedules, setTimeTableSchedules] = useState<TimeTableProps[]>([])
    const { showAlert, AlertComponent } = useConfirmation();

    const getTimeTable = useCallback(() => {
        setIsLoading(true)
        axiosInstance.get("/api/timetable/list", {
            params: {
                date: moment(filter.date).format("YYYY-MM-DD"),
                instituteFacultyId: filter?.facultyId || "",
                instituteStreamId: filter?.streamId || "",
                classId: filter?.classId || "",
            }
        }).then((res) => {
            setTimeTableSchedules(res.data);
            setIsLoading(false)
        });
    }, [filter.date, filter.facultyId, filter.streamId, filter.classId]);

    useEffect(() => {
        getTimeTable();
    }, [getTimeTable]);

    useEffect(() => {
        axiosInstance.get("/api/institute/faculties").then((res) => {
            setFaculties(res.data)
        })
    }, [])

    useEffect(() => {
        if (filter?.facultyId) {
            axiosInstance.get("/api/institute/streams", {
                params: { facultyId: filter?.facultyId }
            }).then((res) => {
                setStreams(res.data)
            })
        }
    }, [filter?.facultyId])

    useEffect(() => {
        if (filter?.streamId) {
            axiosInstance.get("/api/institute/classes", {
                params: { streamId: filter?.streamId }
            }).then((res) => {
                setClasses(res.data)
            })
        }
    }, [filter?.streamId])

    const dayPropGetter = useCallback(
        (date: moment.MomentInput) => ({
            ...(moment(date).format("DDMMYYYY") === moment(filter.date).format("DDMMYYYY") && {
                style: {
                    backgroundColor: '#2C6EF2',
                    color: 'red',
                },
                className: "girish"
            }),
        }),
        [filter.date]
    )

    const onArchive = (row: TimeTableProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/timetable/delete/${row.id}`).then((res) => {
                        getTimeTable();
                    })
                }
            }
        })
    }
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 2 }}>
                    <Paper elevation={0} >
                        <SelectDropdown
                            sx={{ width: 200 }}
                            placeholder={"faculty"}
                            size="small"
                            onChange={(e: any) => setFilter({ ...filter, facultyId: e?.target?.value, streamId: 0, classId: 0 })}
                            value={filter.facultyId}
                            clearable={true}
                            displayEmpty
                            renderValue={(selected: any) => {
                                if (!selected) {
                                    return <Typography sx={{ color: "text.secondary" }}>Select Faculty</Typography>;
                                } else {
                                    return faculties.find((f) => f.facultyId === selected)?.name;
                                }
                            }}
                        >
                            {faculties.map((item) => (
                                <MenuItem key={item.facultyId} value={item.facultyId}>{item.name}</MenuItem>
                            ))}
                        </SelectDropdown>
                    </Paper>

                    {filter?.facultyId ?
                        <Paper elevation={0} >
                            <SelectDropdown
                                sx={{ width: 200 }}
                                size="small"
                                onChange={(e: any) => setFilter({ ...filter, streamId: e?.target?.value, classId: 0 })}
                                value={filter?.streamId}
                                clearable={true}
                                displayEmpty
                                renderValue={(selected: any) => {
                                    if (!selected) {
                                        return <Typography sx={{ color: "text.secondary" }}>Select Stream</Typography>;
                                    } else {
                                        return streams.find((f) => f.streamId === selected)?.streamName;
                                    }
                                }}
                            >
                                {streams.map((item) => (
                                    <MenuItem key={item.streamId} value={item.streamId}>{item.streamName}</MenuItem>
                                ))}
                            </SelectDropdown>
                        </Paper> : ""}

                    {filter?.streamId ? <Paper elevation={0} >
                        <SelectDropdown
                            sx={{ width: 200 }}
                            size="small"
                            onChange={(e: any) => setFilter({ ...filter, classId: e?.target?.value })}
                            value={filter.classId}
                            clearable={true}
                            displayEmpty
                            renderValue={(selected: any) => {
                                if (!selected) {
                                    return <Typography sx={{ color: "text.secondary" }}>Select Class</Typography>;
                                } else {
                                    return classes.find((f) => f.classId === selected)?.className;
                                }
                            }}
                        >
                            {classes.map((item) => (
                                <MenuItem key={item.classId} value={item.classId}>{item.className}</MenuItem>
                            ))}
                        </SelectDropdown>
                    </Paper> : ""}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Button LinkComponent={Link} href="/timetable/create" variant="contained" size="small" sx={{ pl: 3, pr: 3 }} >
                        Add
                    </Button>
                </Box>
            </Box >
            <Paper elevation={0} sx={{ p: 2 }} >
                <MuiCalendar
                    sx={{ height: 280, width: "700px" }}
                    dayPropGetter={dayPropGetter}
                    onSelectSlot={({ start }: any) => setFilter({ ...filter, date: start })}
                    selectable={true}
                />
            </Paper>

            <Paper elevation={0} sx={{ mt: 1.5 }}>
                <TitleWrapper sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ ml: 1 }} variant="subtitle2">{moment(filter.date).format("DD MMM YYYY")}</Typography>
                    <Typography variant="subtitle2" >
                        Subjects
                    </Typography>
                    <Box></Box>
                </TitleWrapper>
                {isLoading && <Loader minHeight={200} />}
                {!isLoading &&
                    <Grid container columnSpacing={6} rowSpacing={2} sx={{ p: 1.5 }}>
                        {timeTableSchedules.map((item) => (
                            <>
                                <Grid item md={6} sm={12} key={item.id}>
                                    <Paper sx={{ display: "flex", alignItems: "center", border: "1px solid #E1E3E7", height: "100%" }}>
                                        <Box sx={{ textAlign: "center", p: 1 }}>
                                            <Typography variant="caption" sx={{ whiteSpace: "nowrap", display: "block" }}>{moment(item?.startTime, "HH:mm:ss").format("hh:mm A")}</Typography>
                                            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>or</Typography>
                                            <Typography variant="caption" sx={{ whiteSpace: "nowrap", display: "block" }}>{moment(item?.endTime, "HH:mm:ss").format("hh:mm A")}</Typography>
                                        </Box>
                                        <MuiPanel
                                            title={item.subjectName}
                                            sx={{ mt: 0, borderLeft: "1px solid #E1E3E7", borderRadius: 0, width: "100%", height: "100%" }}
                                            elevation={0}
                                            onArchive={() => onArchive(item)}
                                        >
                                            <Typography
                                                sx={{ color: "text.secondary" }}
                                                variant="caption"
                                            >{item.desc}</Typography>
                                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                                                <Avatar src={item.teacherAvtarUrl} sx={{ height: 35, width: 35 }} />
                                                <Typography variant="subtitle2">{item.teacherName || "Not Assign"}</Typography>
                                            </Box>
                                        </MuiPanel>
                                    </Paper>
                                </Grid >
                            </>
                        ))}

                        {timeTableSchedules.length === 0 &&
                            <Grid item sm={12}>
                                <Box sx={{ minHeight: "130px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }} >No data</Typography>
                                </Box>

                            </Grid>}
                    </Grid>}
            </Paper >


            {AlertComponent}
        </>
    )
}