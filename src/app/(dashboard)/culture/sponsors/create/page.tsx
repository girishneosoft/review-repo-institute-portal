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
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import InputAdornment from '@mui/material/InputAdornment';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useRef } from 'react';
import UploadedFilePreview from '@/components/UploadedFilePreview';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextArea from '@/components/TextArea';

const validationSchema = Yup.object({
    name: Yup.string().required('This field is required'),
    mobile: Yup.string().required('This field is required')
        .matches(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
    amount: Yup.string().required('This field is required')
        .matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount value.'),
    sponserFor: Yup.string().required('This field is required'),
    desc: Yup.string().required('This field is required'),
    avtar: Yup.mixed().required('File is required')
        .test('fileType', 'Only image files are allowed', (value: any) => {
            if (!value) return true;
            return ['image/jpeg', 'image/png', 'image/gif'].includes(value?.type);
        }),
});

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const hiddenFileInput = useRef<any>(null);

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
        const formData = new FormData();
        Object.keys(data).map(function (key) {
            formData.append(key, data[key]);
        })

        setIsLoading(true)
        axiosInstance.post("/api/culture/sponser/create", formData)
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/culture/sponsors');
            }).catch(() => {
                setIsLoading(false)
            })
    }

    const uploadedImage: any = watch('avtar');

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                <Button
                    LinkComponent={Link}
                    href="/culture/sponsors"
                    variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}>Back</Button>
            </Box>
            <Paper sx={{ p: 2, height: "100%" }}>
                <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add Sponsor</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={4} sx={{ p: 2 }}>
                        <Grid item sm={12} md={4}>
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
                                        label="Name"
                                        autoFocus
                                        error={!!errors.name}
                                        helperText={errors.name?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={4}>
                            <Controller
                                name="mobile"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Mobile"
                                        error={!!errors.mobile}
                                        helperText={errors.mobile?.message}
                                        InputProps={{ startAdornment: <InputAdornment position='start'>+91</InputAdornment > }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={4}>
                            <Controller
                                name="amount"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        required
                                        margin="normal"

                                        fullWidth
                                        label="Amount"
                                        error={!!errors.amount}
                                        helperText={errors.amount?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={4}>
                            <Controller
                                name="sponserFor"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Sponsor for title"
                                        error={!!errors.sponserFor}
                                        helperText={errors.sponserFor?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={4}>
                            <Controller
                                name="avtar"
                                control={control}
                                defaultValue=""
                                render={({ field }: any) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        fullWidth
                                        label="Upload Photo"
                                        error={!!errors.avtar}
                                        helperText={errors.avtar?.message}
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
                                                        onChange={(e: any) => {
                                                            field.onChange(e?.target?.files[0])
                                                            hiddenFileInput.current.value = '';
                                                        }}
                                                    />
                                                    <FileUploadOutlinedIcon />
                                                </IconButton>
                                            </InputAdornment >
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={4}>
                            {uploadedImage &&
                                <UploadedFilePreview
                                    uploadedImage={URL.createObjectURL(uploadedImage)}
                                    clearField={() => reset({ avtar: "" })}
                                />
                            }
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