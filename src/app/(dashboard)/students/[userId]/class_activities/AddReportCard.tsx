"use client"
import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { Box, Grid, IconButton, InputAdornment, MenuItem } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller } from 'react-hook-form';
import { toastMessage } from '@/utils/toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import { InstituteClassProps } from '@/types';
import UploadedFilePreview from '@/components/UploadedFilePreview';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

interface AddReportCardProps {
    open: boolean;
    classes: InstituteClassProps[];
    studentId: string;
    handleClose: any
}

const validationSchema = Yup.object({
    classId: Yup.string().required('This field is required'),
    reporCardFile: Yup.mixed().required('File is required')
        .test('fileType', 'Only image files are allowed', (value: any) => {
            if (!value) return true;
            return ['image/jpeg', 'image/png', 'image/gif'].includes(value?.type);
        }),
});


export default function AddReportCard({ open, classes, studentId, handleClose }: AddReportCardProps) {
    const hiddenFileInput = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [reportCard, setReportCard] = useState<any>(null)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onUploadImage = (e: any) => {
        setReportCard(e.target.files[0]);
    }

    const onSubmit = (data: any) => {
        const formData = new FormData();
        formData.append("classId", data.classId);
        formData.append("studentId", studentId);
        formData.append("reporCardFile", reportCard);

        setIsLoading(true)
        axiosInstance.post("/api/institute/report_card/add", formData)
            .then((res) => {
                toastMessage(res.data.message, "s")
                handleClose(true)
                setIsLoading(false)
            }).catch(() => {
                setIsLoading(false)
            })
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => handleClose(false)}
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle color={"primary"}>Add report card</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Controller
                                    name="classId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Select class"
                                            autoFocus
                                            error={!!errors.classId}
                                            helperText={errors.classId?.message}

                                        >
                                            {classes.map((item: InstituteClassProps) => (
                                                <MenuItem key={item.classId} value={item.classId}>{item.className}</MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Controller
                                    name="reporCardFile"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }: any) => (
                                        <Input
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Photos"
                                            error={!!errors.reporCardFile}
                                            helperText={errors.reporCardFile?.message}
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
                                                            onChange={onUploadImage}
                                                        />
                                                        <FileUploadOutlinedIcon />
                                                    </IconButton>
                                                </InputAdornment >
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                                    {reportCard && <UploadedFilePreview
                                        uploadedImage={URL.createObjectURL(reportCard)}
                                        clearField={() => { }}
                                    />}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ mr: 2, mb: 1 }}>
                    <Button onClick={() => handleClose(false)}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained">{isLoading ? "Loading..." : "Submit"} </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}