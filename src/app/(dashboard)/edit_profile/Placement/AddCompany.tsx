import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { Box, Grid, IconButton, MenuItem, InputAdornment } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Controller } from 'react-hook-form';
import { toastMessage } from '@/utils/toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import Input from '@/components/InputComponent';

const validationSchema = Yup.object({
    companyName: Yup.string().required('This field is required'),
    companyLogo: Yup.string().required('This field is required'),
});

interface AddCompanyProps {
    callApi: any
}

export default function AddCompany({ callApi }: AddCompanyProps) {
    const hiddenInput = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false)

    const {
        reset,
        setValue,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onUploadImage = (e: any) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        axiosInstance.post("/api/institute/upload_file", formData)
            .then((res) => setValue("companyLogo", res.data.fileName))
    }

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/institute/placement/company/create", data)
            .then((res) => {
                toastMessage(res.data.message, "s")
                setIsLoading(false)
                reset();
                callApi();
            }).catch(() => {
                setIsLoading(false)
            })
    }

    return (
        <>
            <Box component="form" sx={{ mt: 2, p: 1 }}>
                <Grid container spacing={2} sx={{ alignSelf: "center" }}>
                    <Grid item md={3}>
                        <Controller
                            name="companyName"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Partner/ Company Name"
                                    error={!!errors.companyName}
                                    helperText={errors.companyName?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <Input
                            margin="normal"
                            fullWidth
                            label="Add Company photo/Logo"
                            size="small"
                            value={watch("companyLogo") ?? ""}
                            error={!!errors.companyLogo}
                            helperText={errors.companyLogo?.message}
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    <IconButton
                                        aria-label="Upload file"
                                        onClick={() => hiddenInput.current.click()}
                                    >
                                        <input
                                            hidden
                                            type="file"
                                            accept='.jpg,.jpeg,.png,.gif'
                                            ref={hiddenInput}
                                            onChange={(e: any) => onUploadImage(e)}
                                        />
                                        <FileUploadOutlinedIcon />
                                    </IconButton>
                                </InputAdornment >
                            }}
                        />
                    </Grid>
                    <Grid item sm={6} md={2}>
                        <Button
                            size='small'
                            sx={{ mt: 3 }}
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                        >{isLoading ? "Loading..." : "Add"} </Button>
                    </Grid>
                </Grid>
            </Box>
        </ >
    );
}