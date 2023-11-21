"use client"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useState } from 'react';
import { Button, Box, Grid, IconButton, MenuItem, Avatar } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import { toastMessage } from '@/utils/toastify';
import SelectDropdown from '@/components/SelectDropdown';
import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchTeacher from '@/components/SearchTeacher';

const validationSchema = Yup.object().shape({
    teacherId: Yup.object().nullable().required('This field is required').typeError('This field is required'),
    position: Yup.string().required('This field is required'),
});

export default function Page() {
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

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/sport/team_member/create", { ...data, teacherId: data.teacherId.id })
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/sports/team-members');
            }).catch(() => {
                setIsLoading(false)
            })
    }
    console.log(errors)

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                <Button
                    LinkComponent={Link}
                    href="/sports/team-members"
                    variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}
                >Back</Button>
            </Box>
            <Paper sx={{ p: 2, height: "100%" }} elevation={0}>
                <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add team member</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={4} sx={{ p: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="teacherId"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <SearchTeacher
                                        {...field}
                                        margin="normal"
                                        size="medium"
                                        required
                                        fullWidth
                                        label="Search Teacher"
                                        autoFocus
                                        error={!!errors.teacherId}
                                        helperText={errors.teacherId?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="position"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <SelectDropdown
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Designation/ Role"
                                        error={!!errors.position}
                                        helperText={errors.position?.message}

                                    >
                                        <MenuItem value="Sport head">Sport head</MenuItem>
                                        <MenuItem value="Coach">Coach</MenuItem>
                                        <MenuItem value="Personal trainer">Personal trainer</MenuItem>
                                    </SelectDropdown>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                sx={{ mt: 3 }}
                                variant="contained"
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