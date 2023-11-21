import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Box, Grid, Paper, MenuItem, Typography, Avatar } from '@mui/material';
import moment from "moment"
import { Controller } from 'react-hook-form';
import { toastMessage } from '@/utils/toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import Input from '@/components/InputComponent';
import TextArea from '@/components/TextArea';
import SearchTeacher from '@/components/SearchTeacher';
import { InstituteProps } from '@/types';

const validationSchema = Yup.object({
    aboutUs: Yup.string().required('This field is required'),
    policy: Yup.string().required('This field is required'),
    deanId: Yup.object().required('This field is required'),
    deanEducation: Yup.string().required('This field is required'),
    desc: Yup.string().required('This field is required'),
});

interface UpdateGovernanceProps {
    institute: InstituteProps
}

export default function UpdateGovernance({ institute }: UpdateGovernanceProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [dean, setDean] = useState({})

    const {
        reset,
        setValue,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        setValue("aboutUs", institute?.institute?.aboutUs)
        setValue("policy", institute?.institute?.policy)
        setValue("deanEducation", institute?.institute?.deanEducation)
        setValue("desc", institute?.institute?.desc)

        const dean = { id: institute?.institute?.deanId, name: institute?.institute?.dean?.name }

        setValue("deanId", dean)
        setDean(dean)
    }, [institute])

    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/institute/update_governance", { ...data, deanId: data?.deanId?.id })
            .then((res) => {
                toastMessage(res.data.message, "s")
                setIsLoading(false)
            }).catch(() => {
                setIsLoading(false)
            })
    }

    console.log(errors, "errors")

    return (
        <>
            <Box component="form" sx={{ mt: 2, p: 1 }}>
                <Grid container spacing={2} sx={{ alignSelf: "center" }}>
                    <Grid item md={12} sm={12}>
                        <Controller
                            name="aboutUs"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="About Us"
                                    error={!!errors.aboutUs}
                                    helperText={errors.aboutUs?.message}
                                    size="small"
                                    rows={3}
                                    multiline
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={12} sm={12}>
                        <Controller
                            name="policy"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Policy"
                                    error={!!errors.policy}
                                    helperText={errors.policy?.message}
                                    size="small"
                                    rows={3}
                                    multiline
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={3} sm={12}>
                        <Controller
                            name="deanId"
                            control={control}
                            defaultValue={0}
                            render={({ field }) => (
                                <SearchTeacher
                                    {...field}
                                    value={dean}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Dean/ Principle"
                                    error={!!errors.deanId}
                                    helperText={errors.deanId?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={3} sm={12}>
                        <Controller
                            name="deanEducation"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Dean education"
                                    error={!!errors.deanEducation}
                                    helperText={errors.deanEducation?.message}
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item md={6}></Grid>
                    <Grid item md={3}>
                        <Typography sx={{ color: "primary.main" }}>Dean:</Typography>
                        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                            <Paper>
                                <Box sx={{
                                    display: "flex", justifyContent: "space-between", gap: 2, p: 1.5
                                }} >
                                    <Box>
                                        <Avatar src="" variant="square" sx={{ height: 60, width: 60 }} />
                                        <Typography component="p" variant="caption" >{institute?.institute?.dean?.name}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography component="p" variant="caption" >Education</Typography>
                                        <Typography component="p" sx={{ color: "text.secondary" }} variant="caption">{institute?.institute?.deanEducation}</Typography>
                                        <Typography component="p" variant="caption">From</Typography>
                                        <Typography component="p" sx={{ color: "text.secondary" }} variant="caption">{moment(institute?.institute?.assignDeanDate).format("YYYY")}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box >
                    </Grid>
                    <Grid item md={9} sm={12}>
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
                                    label="About dean"
                                    error={!!errors.desc}
                                    helperText={errors.desc?.message}
                                    size="small"
                                    rows={3.7}
                                    multiline
                                />
                            )}
                        />
                    </Grid >
                    <Grid item md={12}>
                        <Button
                            sx={{ pl: 3, pr: 3 }}
                            size='small'
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                        >{isLoading ? "Loading..." : "Update"} </Button>
                    </Grid>
                </Grid>
            </Box >
        </ >
    );
}