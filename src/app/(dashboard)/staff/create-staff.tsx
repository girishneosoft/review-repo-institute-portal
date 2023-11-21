import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Grid, MenuItem } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller } from 'react-hook-form';
import { toastMessage } from '@/utils/toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import { InstituteClassProps, InstituteFacultiesProps, InstituteStreamProps, InstituteSubjectProps } from '@/types';

interface CreateStaff {
    open: boolean;
    handleClose: any
}

const validationSchema = Yup.object({
    firstName: Yup.string().required('This field is required'),
    lastName: Yup.string().required('This field is required'),
    mobile: Yup.string().required('This field is required'),
    email: Yup.string().email('Invalid email address').required('This field is required'),
    facultyId: Yup.string().required('This field is required'),
    // streamId: Yup.string().required('This field is required'),
    // classId: Yup.string(),
    // subjectId: Yup.string(),
});


export default function CreateStaff({ open, handleClose }: CreateStaff) {
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [streams, setStreams] = useState<InstituteStreamProps[]>([]);
    const [classes, setClasses] = useState<InstituteClassProps[]>([]);
    const [subjects, setSubjects] = useState<InstituteSubjectProps[]>([]);

    const [selectedFaculty, setSelectedFaculty] = useState<number | string>("")
    // const [selectedStream, setSelectedStream] = useState<number | string>("")
    // const [selectedClass, setSelectedClass] = useState<number | string>("")

    const [isLoading, setIsLoading] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/teacher/create", data)
            .then((res) => {
                toastMessage(res.data.message, "s")
                handleClose(true)
                setIsLoading(false)
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
        if (selectedFaculty) {
            axiosInstance.get("/api/institute/streams", {
                params: { facultyId: selectedFaculty }
            }).then((res) => {
                setStreams(res.data)
            })
        }
    }, [selectedFaculty])

    // useEffect(() => {
    //     if (selectedStream) {
    //         axiosInstance.get("/api/institute/classes", {
    //             params: { streamId: selectedStream }
    //         }).then((res) => {
    //             setClasses(res.data)
    //         })
    //     }
    // }, [selectedStream])

    // useEffect(() => {
    //     if (selectedClass) {
    //         axiosInstance.get(`/api/institute/class/${selectedClass}/subjects/list`).then((res) => {
    //             setSubjects(res.data)
    //         })
    //     }
    // }, [selectedClass])

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => handleClose(false)}
                maxWidth={"md"}
            >
                <DialogTitle color={"primary"}>Create Staff</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="First name"
                                            autoFocus
                                            error={!!errors.firstName}
                                            helperText={errors.firstName?.message}

                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Last name"
                                            autoFocus
                                            error={!!errors.lastName}
                                            helperText={errors.lastName?.message}

                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="mobile"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Mobile"
                                            autoFocus
                                            error={!!errors.mobile}
                                            helperText={errors.mobile?.message}

                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Email Address"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}

                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Controller
                                    name="facultyId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            onChange={(e: any) => {
                                                field.onChange(e.target.value)
                                                setSelectedFaculty(e.target.value)
                                            }}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Faculty"
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
                            {/* <Grid item xs={12} sm={3}>
                                <Controller
                                    name="streamId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            onChange={(e: any) => {
                                                field.onChange(e.target.value)
                                                setSelectedStream(e.target.value)
                                            }}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Stream"
                                            error={!!errors.streamId}
                                            helperText={errors.streamId?.message}

                                        >
                                            {streams.map((item) => (
                                                <MenuItem key={item.streamId} value={item.streamId}>{item.streamName}</MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid> */}
                            {/* <Grid item xs={12} sm={3}>
                                <Controller
                                    name="classId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            onChange={(e: any) => {
                                                field.onChange(e.target.value)
                                                setSelectedClass(e.target.value)
                                            }}
                                            margin="normal"
                                            fullWidth
                                            label="Assign Class"
                                            error={!!errors.classId}
                                            helperText={errors.classId?.message}

                                        >
                                            {classes.map((item) => (
                                                <MenuItem key={item.classId} value={item.classId}>{item.className}</MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid> */}
                            {/* <Grid item xs={12} sm={3}>
                                <Controller
                                    name="subjectId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            margin="normal"
                                            fullWidth
                                            label="Assign Subject"
                                            error={!!errors.subjectId}
                                            helperText={errors.subjectId?.message}

                                        >
                                            {subjects.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.subjectName}</MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid> */}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ mr: 2, mb: 1 }}>
                    <Button onClick={() => handleClose(false)}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained">{isLoading ? "Loading..." : "Submit"} </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}