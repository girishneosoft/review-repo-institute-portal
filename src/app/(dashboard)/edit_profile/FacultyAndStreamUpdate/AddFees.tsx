import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Grid, IconButton, MenuItem, Typography } from '@mui/material';

import { Controller } from 'react-hook-form';
import { toastMessage } from '@/utils/toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import { InstituteClassProps, InstituteFacultiesProps, InstituteStreamProps, InstituteSubjectProps } from '@/types';

const validationSchema = Yup.object({
    instituteFacultyId: Yup.string().required('This field is required'),
    instituteStreamId: Yup.string().required('This field is required'),
    instituteClassId: Yup.string().required('This field is required'),
    casteCategoryId: Yup.string().required('This field is required'),
    fees: Yup.string().required('This field is required'),
});

interface AddFeesProps {
    callApi: any
}

export default function AddFees({ callApi }: AddFeesProps) {
    const [castCategories, setCastCategories] = useState<any[]>([]);
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [streams, setStreams] = useState<InstituteStreamProps[]>([]);
    const [classes, setClasses] = useState<InstituteClassProps[]>([]);

    const [selectedFaculty, setSelectedFaculty] = useState<number | string>("")
    const [selectedStream, setSelectedStream] = useState<number | string>("")

    const [isLoading, setIsLoading] = useState(false)

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/institute/fees/create", data)
            .then((res) => {
                toastMessage(res.data.message, "s")
                setIsLoading(false)
                reset();
                callApi();
            }).catch(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        axiosInstance.get("/api/institute/faculties").then((res) => {
            setFaculties(res.data)
        })
        axiosInstance.get("/api/caste_category").then((res) => {
            setCastCategories(res.data)
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

    useEffect(() => {
        if (selectedStream) {
            axiosInstance.get("/api/institute/classes", {
                params: { streamId: selectedStream, parentClassOnly: true }
            }).then((res) => {
                setClasses(res.data)
            })
        }
    }, [selectedStream])

    return (
        <>
            <Box component="form" sx={{ mt: 2 }}>
                <Typography variant='subtitle1' sx={{ color: "primary.main", mt: 3, mb: 1 }}>Add Fees details</Typography>
                <Grid container spacing={2} sx={{ alignSelf: "center" }}>
                    <Grid item sm={6} md={3}>
                        <Controller
                            name="instituteFacultyId"
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
                                    label="Select Faculty"
                                    error={!!errors.instituteFacultyId}
                                    helperText={errors.instituteFacultyId?.message}
                                    size="small"
                                >
                                    {faculties.map((item) => (
                                        <MenuItem key={item.facultyId} value={item.facultyId}>{item.name}</MenuItem>
                                    ))}
                                </SelectDropdown>
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Controller
                            name="instituteStreamId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <SelectDropdown
                                    {...field}
                                    onChange={(e: any) => {
                                        field.onChange(e.target.value)
                                        setSelectedStream(e.target.value)
                                    }}
                                    disabled={selectedFaculty ? false : true}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Select Stream"
                                    error={!!errors.instituteStreamId}
                                    helperText={errors.instituteStreamId?.message}
                                    size="small"
                                >
                                    {streams.map((item) => (
                                        <MenuItem key={item.streamId} value={item.streamId}>{item.streamName}</MenuItem>
                                    ))}
                                </SelectDropdown>
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Controller
                            name="instituteClassId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <SelectDropdown
                                    {...field}
                                    disabled={selectedStream ? false : true}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Select Class"
                                    error={!!errors.instituteClassId}
                                    helperText={errors.instituteClassId?.message}
                                    size="small"
                                >
                                    {classes.map((item) => (
                                        <MenuItem key={item.classId} value={item.classId}>{item.className}</MenuItem>
                                    ))}
                                </SelectDropdown>
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Controller
                            name="casteCategoryId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <SelectDropdown
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Select Caste"
                                    error={!!errors.casteCategoryId}
                                    helperText={errors.casteCategoryId?.message}
                                    size="small"
                                >
                                    {castCategories.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </SelectDropdown>
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Controller
                            name="fees"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Fees"
                                    error={!!errors.fees}
                                    helperText={errors.fees?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Button
                            sx={{ mt: 3 }}
                            size='small'
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                        >{isLoading ? "Loading..." : "Add"} </Button>
                    </Grid>
                </Grid>
            </Box>
        </ >
    );
}