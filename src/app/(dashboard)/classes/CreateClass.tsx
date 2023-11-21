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
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import { InstituteFacultiesProps, InstituteStreamProps, DivisionProps, ClassProps } from '@/types';

interface CreateClassProps {
    open: boolean;
    handleClose: any
}

const validationSchema = Yup.object({
    facultyId: Yup.string().required('This field is required'),
    streamId: Yup.string().required('This field is required'),
    classNames: Yup.array().of(Yup.string().required('Class ID is required')),
    divisionNames: Yup.array(),
});


export default function CreateClass({ open, handleClose }: CreateClassProps) {
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [streams, setStreams] = useState<InstituteStreamProps[]>([]);
    const [classes, setClasses] = useState<ClassProps[]>([]);
    const [divisions, setDivisions] = useState<DivisionProps[]>([]);

    const [selectedFaculty, setSelectedFaculty] = useState<number | string>("")
    const [selectedClasses, setSelectedClasses] = useState<string[]>([])
    const [selectedDivisions, setSelectedDivisions] = useState<string[]>([])

    const [isLoading, setIsLoading] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });
    console.log(errors, "errors")
    const onSubmit = (data: any) => {
        setIsLoading(true)
        axiosInstance.post("/api/institute/class/create", data)
            .then((res) => {
                toastMessage(res.data.message, "s")
                handleClose(true)
                setIsLoading(false)
            }).catch(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        axiosInstance.get("/api/institute/faculties").then((res) => {
            setFaculties(res.data)
        })
        axiosInstance.get("/api/divisions").then((res) => {
            setDivisions(res.data)
        })
        axiosInstance.get("/api/classess").then((res) => {
            setClasses(res.data)
        })
    }, [])

    useEffect(() => {
        if (selectedFaculty) {
            axiosInstance.get("/api/institute/streams", {
                params: { facultyId: selectedFaculty }
            }).then((res) => {
                setStreams(res.data)
            })
        }
    }, [selectedFaculty])

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => handleClose(false)}
                maxWidth={"sm"}
                fullWidth={true}
            >
                <DialogTitle color={"primary"}>Add Class</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="facultyId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            onChange={(e: any) => {
                                                field.onChange(e.target.value)
                                                setSelectedFaculty(e.target.value)
                                            }}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Select Department"
                                            error={!!errors.facultyId}
                                            helperText={errors.facultyId?.message}
                                        >
                                            {faculties.map((item) => (
                                                <MenuItem key={item.facultyId} value={item.facultyId}>{item.name}</MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="streamId"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Select Branch"
                                            error={!!errors.streamId}
                                            helperText={errors.streamId?.message}

                                        >
                                            {streams.map((item) => (
                                                <MenuItem key={item.streamId} value={item.streamId}>{item.streamName}</MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="classNames"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            multiple
                                            margin="normal"
                                            onChange={(e: any) => {
                                                field.onChange(e.target.value)
                                                setSelectedClasses(e.target.value)
                                            }}
                                            value={selectedClasses}
                                            required
                                            fullWidth
                                            label="Select Class"
                                            error={!!errors.classNames}
                                            helperText={errors.classNames?.message}
                                            renderValue={(selected: any) => `${selected.length} selected`}
                                        >
                                            {classes.map((item) => (
                                                <MenuItem key={item?.className} value={item?.className}>
                                                    <Checkbox size='small'
                                                        checked={selectedClasses.includes(item.className)}
                                                    />
                                                    <ListItemText primary={item.className} />
                                                </MenuItem>
                                            ))}
                                        </SelectDropdown>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="divisionNames"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectDropdown
                                            {...field}
                                            multiple
                                            margin="normal"
                                            onChange={(e: any) => {
                                                field.onChange(e.target.value)
                                                setSelectedDivisions(e.target.value)
                                            }}
                                            value={selectedDivisions}
                                            fullWidth
                                            label="Select Division"
                                            renderValue={(selected: any) => `${selected.length} selected`}
                                        >
                                            {divisions.map((item) => (
                                                <MenuItem key={item?.name} value={item?.name}>
                                                    <Checkbox size='small'
                                                        checked={selectedDivisions.includes(item.name)}
                                                    />
                                                    <ListItemText primary={item.name} />
                                                </MenuItem>
                                            ))}
                                        </SelectDropdown>
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