"use client"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useState } from 'react';
import { Button, Box, Grid, IconButton, CardHeader, Avatar } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import { toastMessage } from '@/utils/toastify';
import Input from '@/components/InputComponent';
import CloseIcon from '@mui/icons-material/Close';
import { useRef } from 'react';
import UploadedFilePreview from '@/components/UploadedFilePreview';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextArea from '@/components/TextArea';
import SearchStudent from '@/components/SearchStudent';

const validationSchema = Yup.object({
    desc: Yup.string().required('This field is required'),
});

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [student, setStudent] = useState<any>({});
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
        if (students.length === 0) {
            toastMessage(`Please add some "Candidate" and click add button`, "e");
            return
        }

        setIsLoading(true)
        const formData = {
            ...data,
            studentIds: students.map((s) => s.id),
        }
        axiosInstance.post("/api/sport/opportunities/create", formData)
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/sports/opportunities');
            }).catch(() => {
                setIsLoading(false)
            })
    }

    const removeItem = (indexToRemove: number) => {
        let _provided = [...students]
        let newArray = _provided.filter((_, index) => index !== indexToRemove);
        setStudents(newArray)
    }

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}>
                <Button
                    LinkComponent={Link}
                    href="/sports/opportunities"
                    variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}
                >Back</Button>
            </Box>
            <Paper sx={{ p: 2, height: "100%" }} elevation={0}>
                <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add Opportunities</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item sm={12} md={4}>
                            <SearchStudent
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                label="Add selected candidate"
                                onChange={(e: any) => setStudent(e)}
                            />
                        </Grid>
                        <Grid item sm={12} md={4} sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: "flex-start",
                            marginTop: "15px"
                        }}>
                            <Button
                                size="small"
                                variant='contained'
                                onClick={() => {
                                    if (student && student?.name) {
                                        setStudents([...students, student])
                                        setStudent({})
                                    }
                                }}
                            >Add</Button>
                        </Grid>
                        <Grid item sm={12} md={12} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Grid container columnSpacing={15} rowSpacing={1}>
                                {students && students.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={item}>
                                        <Box sx={{ alignItems: "center" }}>
                                            <CardHeader
                                                avatar={
                                                    <Avatar src={item?.User?.avtarUrl} aria-label={item.name} />
                                                }
                                                action={
                                                    <IconButton onClick={() => removeItem(index)}
                                                        color="error" size='small' sx={{ background: "#F0F3FF", mt: 1 }}>
                                                        <CloseIcon fontSize='small' />
                                                    </IconButton>
                                                }
                                                title={item.name}
                                                subheader={item?.User?.userName}
                                            />
                                        </Box>
                                    </Grid>
                                ))}

                            </Grid>
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
                                        label="Description"
                                        error={!!errors.desc}
                                        helperText={errors.desc?.message}
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item sm={12} md={12} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Button
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