"use client"
import { useEffect, useState } from 'react';
import { Button, Box, Grid, MenuItem, Avatar, FormControl, RadioGroup, FormLabel, FormControlLabel, Radio } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import { useRouter } from 'next/navigation';
import MuiDatePicker from '@/components/MuiDatePicker';
import MuiTimePicker from '@/components/MuiTimePicker';
import { ExamTypes, InstituteClassProps, InstituteFacultiesProps, InstituteStreamProps, InstituteSubjectProps } from '@/types';
import moment from 'moment';
import Link from 'next/link';

const validationSchema = Yup.object({
    facultyId: Yup.string().required('This field is required'),
    streamId: Yup.string().required('This field is required'),
    classId: Yup.string().required('This field is required'),
    examTypeId: Yup.string().required('This field is required'),
    subjectId: Yup.string().required('This field is required'),
    examDate: Yup.string().required('This field is required'),
    startTime: Yup.string().required('This field is required'),
    endTime: Yup.string().required('This field is required'),
    totalMarks: Yup.string().required('This field is required'),
});

export default function AssignmentForm({ onSubmit }: any) {
    const [examTypes, setExamTypes] = useState<ExamTypes[]>([]);
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [streams, setStreams] = useState<InstituteStreamProps[]>([]);
    const [classes, setClasses] = useState<InstituteClassProps[]>([]);
    const [subjects, setSubjects] = useState<InstituteSubjectProps[]>([]);

    const [isLoading, setIsLoading] = useState(false);
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

    useEffect(() => {
        axiosInstance.get("/api/institute/faculties").then((res) => {
            setFaculties(res.data)
        })
        axiosInstance.get("/api/institute/exam_types").then((res) => {
            setExamTypes(res.data)
        })
    }, [])

    const facultyId = watch("facultyId")
    useEffect(() => {
        if (facultyId) {
            axiosInstance.get("/api/institute/streams", {
                params: { facultyId: facultyId }
            }).then((res) => {
                setStreams(res.data)
            })
        }
    }, [facultyId])

    const streamId = watch("streamId")
    useEffect(() => {
        if (streamId) {
            axiosInstance.get("/api/institute/classes", {
                params: { streamId: streamId }
            }).then((res) => {
                setClasses(res.data)
            })
        }
    }, [streamId])

    const classId = watch("classId")
    useEffect(() => {
        if (classId) {
            axiosInstance.get(`/api/institute/class/${classId}/subjects/list`).then((res) => {
                setSubjects(res.data)
            })
        }
    }, [classId])

    console.log(errors, "errors")
    return (
        <>
            <Paper sx={{ p: 2, height: "100%" }} elevation={0} >
                <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Create Exam</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={4} sx={{ p: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="facultyId"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <SelectDropdown
                                        {...field}
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
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="streamId"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <SelectDropdown
                                        {...field}
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
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="classId"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <SelectDropdown
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Select Class"
                                        error={!!errors.classId}
                                        helperText={errors.classId?.message}
                                    >
                                        {classes.map((item) => (
                                            <MenuItem key={item.classId} value={item.classId}>{item.className}</MenuItem>
                                        ))}
                                    </SelectDropdown>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="subjectId"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <SelectDropdown
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Select Subject"
                                        error={!!errors.subjectId}
                                        helperText={errors.subjectId?.message}

                                    >
                                        {subjects.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{item.subjectName}</MenuItem>
                                        ))}
                                    </SelectDropdown>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="examDate"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <MuiDatePicker
                                        {...field}
                                        disablePast
                                        required
                                        fullWidth
                                        label="Exam date"
                                        error={!!errors.examDate}
                                        helperText={errors.examDate?.message}
                                        minDate={moment().add(0, "day")}
                                        format="DD/MM/YYYY"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Controller
                                name="startTime"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <MuiTimePicker
                                        {...field}
                                        required
                                        fullWidth
                                        label="Start Time"
                                        error={!!errors.startTime}
                                        helperText={errors.startTime?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Controller
                                name="endTime"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <MuiTimePicker
                                        {...field}
                                        required
                                        fullWidth
                                        label="End Time"
                                        error={!!errors.endTime}
                                        helperText={errors.endTime?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="examTypeId"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <SelectDropdown
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Select Exam type"
                                        error={!!errors.examTypeId}
                                        helperText={errors.examTypeId?.message}
                                    >
                                        {examTypes.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        ))}
                                    </SelectDropdown>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="totalMarks"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        required
                                        fullWidth
                                        label="Total marks"
                                        error={!!errors.totalMarks}
                                        helperText={errors.totalMarks?.message}
                                    >
                                    </Input>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <Button
                                variant="contained"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Start Creating
                            </Button>
                            <Button
                                href="/exams"
                                LinkComponent={Link}
                                sx={{ ml: 1 }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>

                </Box>
            </Paper >
        </>
    )

}

