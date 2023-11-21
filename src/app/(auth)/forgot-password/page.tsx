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
  email: Yup.string().email('Invalid email address').required('Required'),
});

export default function SignIn() {
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
    axiosInstance.post("/api/forget_password", data).then((res) => {
      toastMessage(res.data.message, "s")
      setIsLoading(false)
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

  return (
    <Container sx={{ height: "100%" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={12} sm={12} md={6} sx={{ m: "auto" }}  >
          <Paper
            elevation={0}
            sx={{
              padding: 5,
            }}
          >
            <Typography color={"primary"} component="h1" variant="h5" sx={{ mt: 5, textAlign: "center" }}>
              Forget Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
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
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mt: 8 }}
                  />
                )}
              />

              <Button disabled={isLoading} type="submit" fullWidth variant="contained" sx={{ mt: 5, mb: 5 }}>
                {isLoading ? "Loading..." : "Send reset link"}
              </Button>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <MuiLink sx={{ textDecoration: "none" }} href="/" variant="body2" component={Link}>
                  &lt; Back to Login
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

