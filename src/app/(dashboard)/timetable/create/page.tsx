"use client"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Box, Grid, Container, MenuItem, Avatar, FormControl, FormLabel, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import { toastMessage } from '@/utils/toastify';
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';
import { InstituteFacultiesProps, InstituteClassProps, InstituteStreamProps, InstituteSubjectProps } from '@/types';
import MuiDatePicker from '@/components/MuiDatePicker';
import MuiDayPicker, { daysOfWeek } from '@/components/MuiDayPicker';
import TextArea from '@/components/TextArea';
import MuiTimeRanglePicker from '@/components/MuiTimeRanglePicker';
import moment from "moment";
import CloseIcon from '@mui/icons-material/Close';

const validationSchema = Yup.object({
    facultyId: Yup.string().required('This field is required'),
    streamId: Yup.string().required('This field is required'),
    desc: Yup.string(),
});

interface FormDateProps {
    facultyId: number,
    streamId: number,
    classId: number,
    subjectId: number,
    scheduleDate: string,
    scheduleDays: string[],
    startTime: string,
    endTime: string,
}

export default function Page() {
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [streams, setStreams] = useState<InstituteStreamProps[]>([]);
    const [classes, setClasses] = useState<InstituteClassProps[]>([]);
    const [subjects, setSubjects] = useState<InstituteSubjectProps[]>([]);

    const [formData, setFormData] = useState<FormDateProps>({
        facultyId: 0,
        streamId: 0,
        classId: 0,
        subjectId: 0,
        scheduleDate: "",
        scheduleDays: [],
        startTime: "",
        endTime: "",
    })

    const [isLoading, setIsLoading] = useState(false)
    const [openSetDatePicker, setOpenSetDatePicker] = useState(false)
    const [openDaysPicker, setOpenDaysPicker] = useState(false)
    const [openTimeRangePicker, setOpenTimeRangePicker] = useState(false)

    const router = useRouter();

    const {
        reset,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        setIsLoading(true)
        const payload = {
            ...formData,
            scheduleDate: formData?.scheduleDays.length > 0 ? undefined : moment(formData?.scheduleDate).format("YYYY-MM-DD"),
            scheduleDays: formData?.scheduleDays.toString(),
            startTime: moment(formData.startTime).format("HH:mm"),
            endTime: moment(formData.endTime).format("HH:mm"),
        }
        axiosInstance.post("/api/timetable/create", payload)
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/timetable');
            }).catch(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        axiosInstance.get("/api/institute/faculties").then((res) => {
            setFaculties(res.data)
        })
    }, [])

    useEffect(() => {
        if (formData?.facultyId) {
            axiosInstance.get("/api/institute/streams", {
                params: { facultyId: formData?.facultyId }
            }).then((res) => {
                setStreams(res.data)
            })
        }
    }, [formData?.facultyId])

    useEffect(() => {
        if (formData?.streamId) {
            axiosInstance.get("/api/institute/classes", {
                params: { streamId: formData?.streamId }
            }).then((res) => {
                setClasses(res.data)
            })
        }
    }, [formData?.streamId])

    useEffect(() => {
        if (formData?.classId) {
            axiosInstance.get(`/api/institute/class_subjects`, {
                params: { classId: formData?.classId }
            }).then((res) => {
                setSubjects(res.data)
            })
        }
    }, [formData?.classId])

    const handleChangeScheduleDays = (e: string[]) => {
        setFormData({
            ...formData, scheduleDays: e
        })
    }

    const scheduleDaysValue = useMemo(() => {
        const value = formData?.scheduleDays.map((item) => {
            console.log(daysOfWeek.find((d) => d.value === item)?.name, "name")
            return daysOfWeek.find((d) => d.value === item)?.name
        })
        return value.join(", ");
    }, [formData.scheduleDays])

    return (
        <>
            <Container>
                <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                    <Button
                        LinkComponent={Link}
                        href="/timetable"
                        variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}>Back</Button>
                </Box>
                <Paper sx={{ p: 2, height: "100%" }} elevation={0} >
                    <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add calendar</Typography>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={4} sx={{ p: 2 }}>
                            <Grid item xs={12} md={3}>
                                <Controller
                                    name="facultyId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            size="small"
                                            onChange={(e: any) => {
                                                field.onChange(e.target.value)
                                                setFormData({ ...formData, facultyId: e.target.value })
                                            }}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Select Faculty"
                                            error={!!errors.facultyId}
                                            helperText={errors.facultyId?.message}

                                        >
                                            {faculties.map((item) => (
                                                <MenuItem key={item.facultyId} value={item.facultyId}>{item.name}</MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Controller
                                    name="streamId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            size="small"
                                            onChange={(e: any) => {
                                                field.onChange(e.target.value)
                                                setFormData({ ...formData, streamId: e.target.value })
                                            }}
                                            disabled={formData?.facultyId ? false : true}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Select Stream"
                                            error={!!errors.streamId}
                                            helperText={errors.streamId?.message}

                                        >
                                            {streams.map((item) => (
                                                <MenuItem key={item.streamId} value={item.streamId}>{item.streamName}</MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid>
                            {!!formData.streamId && <Grid item xs={12} md={12}>
                                <FormControl>
                                    <FormLabel sx={{ fontSize: '0.9rem' }}>Select Class</FormLabel>
                                    <Box sx={{ display: "flex", gap: 1, mt: 1, flexFlow: "row wrap" }}>
                                        {classes.map((item) => (
                                            <CustomButton
                                                active={formData?.classId === item.classId ? true : false}
                                                sx={{ textTransform: "none" }}
                                                key={item.classId}
                                                onClick={() => setFormData({ ...formData, classId: item.classId })}
                                            >{item.className}</CustomButton>
                                        ))}
                                    </Box>
                                </FormControl>
                            </Grid>}

                            {!!formData.classId && <Grid item xs={12} md={12}>
                                <FormControl>
                                    <FormLabel sx={{ fontSize: '0.9rem' }}>Select Subject</FormLabel>
                                    <Box sx={{ display: "flex", gap: 1, mt: 1, flexFlow: "row wrap" }}>
                                        {subjects.map((item) => (
                                            <CustomButton
                                                active={formData?.subjectId === item.id ? true : false}
                                                sx={{ textTransform: "none" }}
                                                key={item.id}
                                                onClick={() => setFormData({ ...formData, subjectId: item.id })}
                                            >{item.subjectName}</CustomButton>
                                        ))}
                                    </Box>
                                </FormControl>
                            </Grid>}

                            <Grid item xs={12} md={12}>
                                <FormControl>
                                    <FormLabel sx={{ fontSize: '0.9rem' }}>Schedule lecture time</FormLabel>
                                    <Box sx={{ display: "flex", gap: 1, mt: 1, flexFlow: "row wrap", alignItems: "center" }}>
                                        <Box sx={{ position: "relative" }}>
                                            <CustomButton
                                                sx={{ textTransform: "none" }}
                                                onClick={(e: any) => {
                                                    setOpenSetDatePicker(true)
                                                }}

                                            >Set date</CustomButton>

                                            <MuiDatePicker
                                                isMobile={true}
                                                open={openSetDatePicker}
                                                onClose={() => setOpenSetDatePicker(false)}
                                                value={formData?.scheduleDate}
                                                onChange={(e: any) => setFormData({ ...formData, scheduleDate: e })}
                                                sx={{ display: 'none' }}
                                                label={''}

                                            />
                                        </Box>
                                        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>Or</Typography>
                                        <Box>
                                            <CustomButton
                                                sx={{ textTransform: "none" }}
                                                onClick={() => setOpenDaysPicker(true)}
                                            >Set days</CustomButton>
                                            <MuiDayPicker
                                                open={openDaysPicker}
                                                handleChange={(e: any) => handleChangeScheduleDays(e)}
                                                value={formData?.scheduleDays}
                                                handleClose={() => setOpenDaysPicker(false)}
                                            />
                                        </Box>
                                        <Button
                                            variant='contained'
                                            sx={{ textTransform: "none" }}
                                            endIcon={<AddIcon />}
                                            onClick={() => setOpenTimeRangePicker(true)}
                                            size="small"
                                        >Set Time</Button>
                                        <MuiTimeRanglePicker
                                            value={{ start: formData?.startTime, end: formData?.endTime }}
                                            open={openTimeRangePicker}
                                            handleClose={() => setOpenTimeRangePicker(false)}
                                            handleChange={(e: any) => setFormData({ ...formData, startTime: e.start, endTime: e.end })}
                                        />
                                    </Box>
                                </FormControl>
                            </Grid>
                            {(formData?.scheduleDate || formData?.scheduleDays.length || formData?.startTime || formData?.endTime) && <Grid item xs={12} md={12}>
                                <FormLabel sx={{ fontSize: '0.9rem' }}>Schedule lecture time</FormLabel>
                                <Box sx={{ display: "flex", gap: 4, mt: 1, flexFlow: "row wrap", alignItems: "center" }}>
                                    <Typography variant="subtitle2" sx={{ color: "#000000" }}>
                                        {formData?.scheduleDays.length > 0 ? scheduleDaysValue : moment(formData.scheduleDate).format("DD MMM YYYY")}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: "#000000" }}
                                    >{formData?.endTime ? `${moment(formData?.startTime).format("HH:MM A")} - ${moment(formData?.endTime).format("HH:MM A")}` : ""}
                                    </Typography>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => setFormData({ ...formData, scheduleDate: "", scheduleDays: [], startTime: "", endTime: "" })}
                                    ><CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Grid>}
                            <Grid item xs={12} md={12}>
                                <Controller
                                    name="desc"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextArea
                                            {...field}
                                            size="small"
                                            margin="normal"
                                            fullWidth
                                            label="Description"
                                            multiline
                                            rows={4}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    // sx={{ mt: 3, mb: 2 }}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {isLoading ? "Loading..." : "Submit"}
                                </Button>
                            </Grid>
                        </Grid>

                    </Box>
                </Paper >
            </Container>
        </>
    )

}