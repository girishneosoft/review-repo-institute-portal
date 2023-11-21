"use client"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useState } from 'react';
import { Button, Box, Grid, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import { toastMessage } from '@/utils/toastify';
import Input from '@/components/InputComponent';
import InputAdornment from '@mui/material/InputAdornment';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useRef } from 'react';
import UploadedFilePreview from '@/components/UploadedFilePreview';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextArea from '@/components/TextArea';
import SearchTeacher from '@/components/SearchTeacher';

const validationSchema = Yup.object({
    title: Yup.string().required('This field is required'),
    managedBy: Yup.object().required('This field is required'),
    tripDate: Yup.string().required('This field is required'),
    totalStudent: Yup.string().required('This field is required'),
    tripDetails: Yup.string().required('This field is required'),
});

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [photos, setPhotos] = useState<any[]>([]);
    const router = useRouter();
    const hiddenFileInput = useRef<any>(null);

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
        const formData = { ...data, managedBy: data?.managedBy?.id, photos: photos.map((p) => p.fileName) }
        axiosInstance.post("/api/institute_trip/create", formData)
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/culture/trips');
            }).catch(() => {
                setIsLoading(false)
            })
    }

    const onUploadFile = (e: any) => {
        let _photos: any = [...photos];
        const formData = new FormData();

        formData.append("image", e.target.files[0]);

        axiosInstance.post("/api/institute_trip/upload_trip_photo", formData)
            .then((response) => {
                _photos = [..._photos, {
                    preview: e.target.files[0],
                    fileName: response?.data?.fileName
                }]
                setPhotos(_photos);
                hiddenFileInput.current.value = '';
            })
    }

    return (
        <>

            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}>
                <Button
                    LinkComponent={Link}
                    href="/culture/trips"
                    variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}
                >Back</Button>
            </Box>
            <Paper sx={{ p: 2, height: "100%" }} elevation={0}>
                <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add trip</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item sm={12} md={4}>
                            <Controller
                                name="title"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        label="Trip Title"
                                        autoFocus
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={3}>
                            <Controller
                                name="tripDate"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        type='date'
                                        {...field}
                                        margin="normal"
                                        required
                                        size="small"
                                        fullWidth
                                        label="Select trip date"
                                        error={!!errors.tripDate}
                                        helperText={errors.tripDate?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={3}>
                            <Controller
                                name="managedBy"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <SearchTeacher
                                        {...field}
                                        required
                                        size="small"
                                        fullWidth
                                        label="Managed By"
                                        error={!!errors.managedBy}
                                        helperText={errors.managedBy?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={2}>
                            <Controller
                                name="totalStudent"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        margin="normal"
                                        size="small"
                                        required
                                        fullWidth
                                        label="Student Count"
                                        error={!!errors.totalStudent}
                                        helperText={errors.totalStudent?.message}

                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={12} md={12}>
                            <Controller
                                name="tripDetails"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextArea
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Details Description"
                                        error={!!errors.tripDetails}
                                        helperText={errors.tripDetails?.message}
                                        multiline
                                        rows={5}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={3}>
                            <Input
                                size="small"
                                margin="normal"
                                fullWidth
                                label="Upload Photo"
                                disabled
                                value={""}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end'>
                                        <IconButton
                                            aria-label="Upload file"
                                            onClick={() => hiddenFileInput.current.click()}
                                        >
                                            <input
                                                hidden
                                                type="file"
                                                accept='.jpg,.jpeg,.png,.gif'
                                                ref={hiddenFileInput}
                                                onChange={(e: any) => onUploadFile(e)}
                                            />
                                            <FileUploadOutlinedIcon />
                                        </IconButton>
                                    </InputAdornment >
                                }}
                            />
                        </Grid>
                        <Grid item sm={12} md={12}>
                            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                                {photos.map((item) => (
                                    <UploadedFilePreview
                                        key={item.fileName}
                                        uploadedImage={URL.createObjectURL(item.preview)}
                                        clearField={() => { }}
                                    />
                                ))}
                            </Box>

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