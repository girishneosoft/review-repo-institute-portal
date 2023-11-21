import { useState } from "react"
import Input from "@/components/InputComponent"
import { Box, Button, Grid, formControlLabelClasses } from "@mui/material"
import { Controller } from "react-hook-form";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from "@/utils/axiosInstance";
import SearchTeacher from "@/components/SearchTeacher";
import { toastMessage } from "@/utils/toastify";
import { useEffect } from "react";

const validationSchema = Yup.object({
    subjectName: Yup.string().required('This field is required'),
    subjectShortName: Yup.string().required('This field is required'),
    teacherId: Yup.object(),
});

interface AddEditSubjectProps {
    classId: number | string;
    editSubjectItem?: any;
    cancelEdit?: any;
    callApi: any
}

export default function AddEditSubject({ classId, editSubjectItem, cancelEdit, callApi }: AddEditSubjectProps) {
    const [isLoading, setIsLoading] = useState(false)
    const {
        control,
        setValue,
        reset,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        setValue("subjectName", editSubjectItem?.subjectName)
        setValue("subjectShortName", editSubjectItem?.subjectShortName)
        setValue("teacherId", { id: editSubjectItem?.teacherId, name: editSubjectItem?.assignTeacherName })
    }, [editSubjectItem])

    const onCancelEdit = () => {
        reset();
        cancelEdit()
    }

    const onSubmit = (data: any) => {
        setIsLoading(true)
        const payload = {
            ...data,
            teacherId: data?.teacherId?.id,
            instituteStreamClassId: classId
        }

        if (editSubjectItem?.id) {
            axiosInstance.put(`/api/institute/class/subject/${editSubjectItem?.id}`, payload).then((res) => {
                reset();
                toastMessage(res.data.message, "s")
                callApi()
                onCancelEdit(); // on clear field
                setIsLoading(false)
            }).catch(() => setIsLoading(false))
        } else {
            axiosInstance.post("/api/institute/class/subject/create", payload).then((res) => {
                reset();
                toastMessage(res.data.message, "s")
                callApi()
                setIsLoading(false)
            }).catch(() => setIsLoading(false))
        }
    }
    console.log(errors, getValues(), "errors")
    return (
        <>
            <Grid container spacing={2} >
                <Grid item md={4} xs={12}>
                    <Controller
                        name="subjectName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                label="Subject Name"
                                error={!!errors.subjectName}
                                helperText={errors.subjectName?.message}

                            />
                        )}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <Controller
                        name="subjectShortName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                size="small"
                                label="Subject name in short"
                                error={!!errors.subjectShortName}
                                helperText={errors.subjectShortName?.message}

                            />
                        )}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <Controller
                        name="teacherId"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <SearchTeacher
                                {...field}
                                required={false}
                            />
                        )}
                    />
                </Grid>
                <Grid item md={2} xs={12} sx={{ mt: "14px", display: "flex", justifyContent: "flex-start", gap: 1, alignItems: "center" }}>
                    <Button size="small" variant="contained"
                        sx={{ pr: 2, pl: 2 }}
                        onClick={handleSubmit(onSubmit)}
                    >{isLoading ? "Loading..." : (editSubjectItem?.id ? "Update" : "Add")}</Button>
                    {editSubjectItem?.id && <Button size="small" variant="outlined"
                        sx={{ pr: 2, pl: 2 }}
                        onClick={onCancelEdit}
                    >Cancel</Button>}
                </Grid>
            </Grid>
        </>
    )
}