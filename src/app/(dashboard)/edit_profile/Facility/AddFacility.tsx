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
import SelectInput from '@mui/material/Select/SelectInput';
import TextArea from '@/components/TextArea';

const validationSchema = Yup.object({
    title: Yup.string().required('This field is required'),
    desc: Yup.string().required('This field is required'),
});

interface AddFacilityProps {
    callApi: any
}

export default function AddFacility({ callApi }: AddFacilityProps) {

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
        axiosInstance.post("/api/institute/facility/create", data)
            .then((res) => {
                toastMessage(res.data.message, "s")
                setIsLoading(false)
                reset();
                callApi();
            }).catch(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            <Box component="form" sx={{ mt: 2, p: 1 }}>
                <Grid container spacing={2} sx={{ alignSelf: "center" }}>
                    <Grid item md={12}>
                        <Controller
                            name="title"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Facility Title"
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={12}>
                        <Controller
                            name="desc"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Description"
                                    error={!!errors.desc}
                                    helperText={errors.desc?.message}
                                    size="small"
                                    rows={3}
                                    multiline
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={1}>
                        <Button
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