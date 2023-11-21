import React from 'react';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Link from 'next/link';
import Register from './Register';
import { axiosInstance } from '@/utils/axiosInstance';

async function getState() {
  const res = await axiosInstance.get("/api/state");
  return res.data;
}

async function getFaculties() {
  const res = await axiosInstance.get("/api/faculties")
  return res.data;
}

export default async function Page() {

  const [states, faculties] = await Promise.all([getState(), getFaculties()])

  return (
    <Container sx={{ height: "100%" }}>
      <Grid container spacing={2} sx={{ pt: 1, pb: 1 }}>
        <Grid item sm={4}>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIosNewOutlinedIcon />}
            size="small" variant='outlined'
          >Back</Button>
        </Grid>
        <Grid item sm={4}>
          <Typography color={"primary"} component="h2" variant="h6" sx={{ textAlign: "center" }}>
            Registration
          </Typography>
        </Grid>
      </Grid>
      <Paper
        elevation={0}
        sx={{ width: '100%', minHeight: "88%" }}
      >
        <Register states={states} faculties={faculties} />
      </Paper>
    </Container>
  );
}
