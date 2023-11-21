"use client"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

import { Button, Box, Grid, MenuItem, Avatar } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import { toastMessage } from '@/utils/toastify';
import Input from '@/components/InputComponent';
import TextArea from '@/components/TextArea';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const validationSchema = Yup.object({
    fromLocation: Yup.string().required('This field is required'),
    toLocation: Yup.string().required('This field is required'),
    fees: Yup.string().required('This field is required'),
    desc: Yup.string().required('This field is required'),

});

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/transport_fees/create", data)
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/transport/fees');
            }).catch(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                <Button
                    LinkComponent={Link}
                    href="/transport/fees"
                    variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}>Back</Button>
            </Box>
            <Paper sx={{ p: 2, height: "fit-content" }} elevation={0} >
                <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add Fees</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={4} sx={{ p: 2 }}>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name="fromLocation"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="From (Location)"
                                        autoFocus
                                        error={!!errors.fromLocation}
                                        helperText={errors.fromLocation?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name="toLocation"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="To (Location)"
                                        error={!!errors.toLocation}
                                        helperText={errors.toLocation?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
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
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
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
                                        label="Details Description"
                                        error={!!errors.desc}
                                        helperText={errors.desc?.message}
                                        multiline
                                        rows={6}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                // sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit(onSubmit)}
                            >
                                {isLoading ? "Loading..." : "Submit"}
                            </Button>
                        </Grid>
                    </Grid>

                </Box>
            </Paper >
        </>
    )

}