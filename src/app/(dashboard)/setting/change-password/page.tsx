"use client"

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import QRCode from "react-qr-code";
import MuiLink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Container, IconButton, InputAdornment, Paper } from '@mui/material';
import Input from '@/components/InputComponent';
import Link from 'next/link';
import { toastMessage } from '@/utils/toastify';
import { deleteToken } from '@/app/(auth)/action';

const validationSchema = Yup.object({
    currentPassword: Yup.string().required('This field is required'),
    password: Yup.string().required('This field is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character'
        ),
    confirmPassword: Yup.string().required('This field is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
});

interface ResetPasswordProps {
    searchParams: { resetToke: string }
}
export default function Page({ searchParams }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/change_password", data).then((res) => {
            toastMessage(res.data.message, "s")
            deleteToken();
            router.push('/')
        }).catch(() => {
            setIsLoading(false)
        })
    };

    return (
        <Paper sx={{ height: "100%", p: 2 }}>
            <Box sx={{ margin: "auto", maxWidth: 500 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
                    <Typography color={"primary"} component="h1" variant="h5" sx={{ mb: 3, textAlign: "center" }}>
                        Change Password
                    </Typography>
                    <Controller
                        name="currentPassword"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                label="Current Password"
                                type={'password'}
                                autoComplete="current-password"
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword?.message}
                                sx={{ mt: 1 }}
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                label="New Password"
                                type={'password'}
                                autoComplete="current-password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{ mt: 1 }}
                            />
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                sx={{ mt: 1 }}
                                inputSx={{ borderRight: 0 }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {!showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    )
                                }}
                            />
                        )}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, mb: 2 }}>
                        {isLoading ? "Loading..." : "Update Password"}
                    </Button>
                </Box>
            </Box>
        </Paper >

    );
}

