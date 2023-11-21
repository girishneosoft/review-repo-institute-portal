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
import { getToken, storeToken } from "./../action"
import Link from 'next/link';
import { toastMessage } from '@/utils/toastify';

const validationSchema = Yup.object({
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
    axiosInstance.post("/api/reset_password", { ...data, ...searchParams }).then((res) => {
      toastMessage(res.data.message, "s")
      router.push('/')
    }).catch(() => {
      setIsLoading(false)
    })
  };

  const checkAuthentication = async () => {
    const token = await getToken();
    if (token) {
      router.push('/students')
    }
  }

  useEffect(() => {
    checkAuthentication();
  }, [])
  console.log(errors, "errors")
  return (
    <Container sx={{ height: "100%" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={12} sm={12} md={6} sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%"
        }} >
          <Paper
            elevation={0}
            sx={{
              padding: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography color={"primary"} component="h1" variant="h5">
              Create Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
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
                    sx={{ mt: 4 }}
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
                    sx={{ mt: 4 }}
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

              <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                <Typography color="text.secondary" variant="body2" gutterBottom>{`< Back to`}&nbsp;</Typography>
                <MuiLink href="/" variant="body2" component={Link}>
                  Login
                </MuiLink>

              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6} sx={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: 'center',
          alignItems: 'center',
          gap: "28px",
        }}
        >
          <Typography
            variant="h4" component="h2"
            color="primary">
            alpha
          </Typography>
          <div style={{ background: 'white', padding: '16px' }}>
            <QRCode
              size={256}
              style={{ height: "150px", maxWidth: "100%", width: "100%" }}
              value={"my android application"}
              viewBox={`0 0 256 256`}
            />
          </div>
          <Typography style={{ textAlign: "center" }}>Students & Staff should log in<br />
            through QR code</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

