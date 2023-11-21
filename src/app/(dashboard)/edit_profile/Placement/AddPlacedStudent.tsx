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
import SearchStudent from '@/components/SearchStudent';
import SelectDropdown from '@/components/SelectDropdown';
import { CompanyProps } from '@/types';

const validationSchema = Yup.object({
    studentId: Yup.object().nullable().required('This field is required').typeError('This field is required'),
    companyId: Yup.string().required('This field is required'),
    avtarPath: Yup.string().required('This field is required'),
    providedPackage: Yup.string().required('This field is required'),
});

interface AddCompanyProps {
    companies: CompanyProps[];
    callApi: any
}

export default function AddCompany({ companies, callApi }: AddCompanyProps) {
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
            .then((res) => setValue("avtarPath", res.data.fileName))
    }

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/institute/placement/student/create", { ...data, studentId: data?.studentId?.id })
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
                            name="studentId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <SearchStudent
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Search Student"
                                    error={!!errors.studentId}
                                    helperText={errors.studentId?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <Input
                            margin="normal"
                            fullWidth
                            label="Student Photo"
                            size="small"
                            value={watch("avtarPath") ?? ""}
                            error={!!errors.avtarPath}
                            helperText={errors.avtarPath?.message}
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
                    <Grid item md={3}>
                        <Controller
                            name="companyId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <SelectDropdown
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Select Company Name"
                                    error={!!errors.companyId}
                                    helperText={errors.companyId?.message}
                                    size="small"
                                >
                                    {companies.map((c) => (
                                        <MenuItem key={c.id} value={c.id}>{c.companyName}</MenuItem>
                                    ))}
                                </SelectDropdown>
                            )}
                        />
                    </Grid>
                    <Grid item md={2}>
                        <Controller
                            name="providedPackage"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Provided Package"
                                    error={!!errors.providedPackage}
                                    helperText={errors.providedPackage?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={6} md={1}>
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