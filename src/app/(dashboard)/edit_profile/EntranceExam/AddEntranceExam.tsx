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
    facultyId: Yup.string().required('This field is required'),
    entranceName: Yup.string().required('This field is required'),
    examLink: Yup.string().required('This field is required'),
    merit: Yup.string(),
});

interface AddEntranceExamProps {
    callApi: any
}

export default function AddEntranceExam({ callApi }: AddEntranceExamProps) {
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);

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
        axiosInstance.post("/api/institute/entrance_exam/create", data)
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
    }, [])

    return (
        <>
            <Box component="form" sx={{ mt: 2 }}>
                <Typography variant='h6' sx={{ color: "primary.main", mt: 3, mb: 1 }}>Add Entrance Exam details</Typography>
                <Grid container spacing={2} sx={{ alignSelf: "center" }}>
                    <Grid item sm={6} md={3}>
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
                            name="entranceName"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Exam name"
                                    error={!!errors.entranceName}
                                    helperText={errors.entranceName?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={3}>
                        <Controller
                            name="examLink"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Exam link"
                                    error={!!errors.examLink}
                                    helperText={errors.examLink?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={2}>
                        <Controller
                            name="merit"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    fullWidth
                                    label="Merit"
                                    error={!!errors.merit}
                                    helperText={errors.merit?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={1}>
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