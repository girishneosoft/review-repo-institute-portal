import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Grid, MenuItem, Checkbox, ListItemText } from '@mui/material';
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
import SearchTeacher from '@/components/SearchTeacher';

interface AssignClassTeacherPopUpProps {
    open: boolean;
    classId: number | any;
    classTeacherId?: any;
    handleClose: any
}

const validationSchema = Yup.object({
    teacherId: Yup.object().required('This field is required'),
});


export default function AssignClassTeacherPopUp({ open, classId, classTeacherId, handleClose }: AssignClassTeacherPopUpProps) {
    const [isLoading, setIsLoading] = useState(false)

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        setValue("teacherId", classTeacherId)
    }, [])

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post(`/api/institute/class/${classId}/assign_teacher`, { teacherId: data?.teacherId?.id })
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
                fullWidth={true}
            >
                <DialogTitle color={"primary"}>Assign Class Teacher</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="teacherId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SearchTeacher
                                            {...field}
                                        />
                                    )}
                                />
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