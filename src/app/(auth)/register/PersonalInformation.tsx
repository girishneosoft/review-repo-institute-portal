"use client"

import React, { useEffect, useState } from 'react';
import Input from '@/components/InputComponent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Controller } from 'react-hook-form';
import { Box, IconButton, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { axiosInstance } from '@/utils/axiosInstance';


export default function PersonalInformation({ control, errors, handleSubmit, onSubmit, watch }: any) {
    const [showPassword, setShowPassword] = useState(false);
    const [suggestUsername, setSuggestUsername] = useState<string[]>([]);
    const [usernameStatus, setUsernameStatus] = useState("");

    const generateUsername = (e: any) => {
        if (watch("email") && watch("email").length > 4) {
            axiosInstance.post(`/api/institute/suggest_username/${watch("email")}`)
                .then((res) => {
                    setSuggestUsername(res.data)
                })
        }
    }

    const checkUserName = (e: any) => {
        if (watch("instituteUsername") && watch("instituteUsername").length > 7) {
            axiosInstance.post(`/api/institute/check_username/${watch("instituteUsername")}`)
                .then((res) => {
                    setUsernameStatus(res.data.status)
                })
        }
    }

    return (
        <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                label="Institute name"
                                autoFocus
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={{ mt: 4 }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                onBlur={(e) => {
                                    field.onBlur()
                                    generateUsername(e)
                                }}
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{ mt: 4 }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="instituteUsername"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <>
                                <Input
                                    {...field}
                                    onBlur={(e) => {
                                        field.onBlur()
                                        checkUserName(e)
                                    }}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        setUsernameStatus("")
                                    }}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Create username"
                                    error={!!errors.instituteUsername}
                                    helperText={errors.instituteUsername?.message}
                                    sx={{ mt: 4 }}
                                    autoComplete='new-password'
                                />
                                {usernameStatus === "taken" && <Typography sx={{ textAlign: "right", color: "error.light" }} variant="body2">Taken</Typography>}
                                {usernameStatus === "available" && <Typography sx={{ textAlign: "right", color: "success.light" }} variant="body2">Available</Typography>}

                            </>
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                margin="normal"
                                type="password"
                                required
                                fullWidth
                                label="Password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{ mt: 4 }}
                                autoComplete='new-password'
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                margin="normal"
                                type={showPassword ? 'text' : 'password'}
                                required
                                fullWidth
                                label="Confirm password"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                sx={{ mt: 4 }}
                                autoComplete='new-password'
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
                </Grid>
                <Grid item xs={12} sm={4}>
                    {suggestUsername.length > 0 && <>
                        <Typography color="text.secondary" variant='subtitle2'>Username suggestions</Typography>
                        {suggestUsername.map((username) => (
                            <Typography key={username} color="primary" variant="body2">{username}</Typography>
                        ))}
                    </>
                    }
                </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit(onSubmit)}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
}
