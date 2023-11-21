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

const validationSchema = Yup.object({
    firstName: Yup.string().required('This field is required'),
    lastName: Yup.string().required('This field is required'),
    mobile: Yup.string().required('This field is required')
        .matches(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
    position: Yup.string().required('This field is required'),
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
        axiosInstance.post("/api/canteen/team_member/create", formData)
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/canteen/team-members');
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
                    href="/canteen/team-members"
                    variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}>Back</Button>
            </Box>
            <Paper sx={{ p: 2, height: "100%" }} elevation={0} >
                <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add team member</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={4} sx={{ p: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="firstName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="First name"
                                        autoFocus
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="lastName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Last name"
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
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
                                        <MenuItem value="Manager">Manager</MenuItem>
                                        <MenuItem value="Waiter">Waiter</MenuItem>
                                        <MenuItem value="Chef">Chef</MenuItem>
                                    </SelectDropdown>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="avtar"
                                control={control}
                                defaultValue=""
                                render={({ field }: any) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Upload Photo"
                                        error={!!errors.avtar}
                                        helperText={errors.avtar?.message}
                                        disabled
                                        value={uploadedImage?.name}
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
                                                        onChange={(e: any) => field.onChange(e?.target?.files[0])}
                                                    />
                                                    <FileUploadOutlinedIcon />
                                                </IconButton>
                                            </InputAdornment >
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            {uploadedImage &&
                                <UploadedFilePreview
                                    uploadedImage={URL.createObjectURL(uploadedImage)}
                                    clearField={() => reset({ avtar: "" })}
                                />
                            }
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