"use client"

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, Checkbox, IconButton, ListItemText, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { axiosInstance } from '@/utils/axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, MenuItem } from '@mui/material';
import SelectDropdown from '@/components/SelectDropdown';
import { FacultiesProps, StateProps } from '@/types';
import StreamInputModal from './StreamInputModal';
import { toastMessage } from '@/utils/toastify';

interface DepartmentInformationProps {
    states: StateProps[];
    faculties: FacultiesProps[];
    stateId: number | string;
    setStateId: any;
    selectedFaculties: number[];
    setSelectedFaculties: any;
    selectedStreams: number[];
    setSelectedStreams: any;
    onSubmit: any
}
export default function DepartmentInformation({ stateId, setStateId, selectedFaculties, setSelectedFaculties, selectedStreams, setSelectedStreams, onSubmit, states, faculties }: DepartmentInformationProps) {
    const [openStreamModal, setOpenStreamModal] = useState(false);

    const handleSubmit = () => {
        if (!stateId) {
            return toastMessage("Please select state", "e")
        } else if (selectedFaculties.length === 0) {
            return toastMessage("Please select department", "e")
        } else if (selectedStreams.length === 0) {
            return toastMessage("Please select branch", "e")
        }

        let _selectedStreams: number[] = [];

        faculties.filter((f) => selectedFaculties.includes(f.id)).forEach((item) => {
            const currentFacultyStream = item.Streams.filter((s) => selectedStreams.includes(s.id)).map((i) => i.id);
            if (currentFacultyStream.length === 0) {
                return toastMessage(`You are selected ${item.name} department but not selected any branch`, "e");
            }
            _selectedStreams = _selectedStreams.concat(currentFacultyStream);
        });

        onSubmit({
            stateId, facultyIds: selectedFaculties, streamIds: selectedStreams
        }, true)
    }

    const updateSelectedStreams = (_selectedFaculties: number[]) => {
        let updatedStream: number[] = [];
        faculties.filter(f => selectedFaculties.includes(f.id)).map((item) => {
            item.Streams.map((val) => {
                if (selectedStreams.includes(val.id)) {
                    updatedStream.push(val.id)
                }
            })
        })
        setSelectedStreams(updatedStream);
    }

    const onRemoveFaculty = (id: number) => {
        let _selectedFaculties = [...selectedFaculties];
        let _selectedStreams = [...selectedStreams];
        _selectedFaculties = _selectedFaculties.filter((item) => item !== id);
        setSelectedFaculties(_selectedFaculties);

        faculties.filter(f => id === f.id).map((item) => {
            item.Streams.map((val) => {
                _selectedStreams = _selectedStreams.filter((s) => s !== val.id)
            })
        })
        setSelectedStreams(_selectedStreams);
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>

                    <SelectDropdown
                        required
                        fullWidth
                        placeholder="Select State"
                        label="Select State"
                        onChange={(e: any) => setStateId(e.target.value)}
                        value={stateId}
                    >
                        {states.map((row) => <MenuItem key={row?.id} value={row?.id}>{row.name}</MenuItem>)}
                    </SelectDropdown>

                </Grid>
                <Grid item xs={12} sm={4}>
                    <SelectDropdown
                        multiple
                        required
                        fullWidth
                        placeholder="Department"
                        label="Department/ Faculty"
                        value={selectedFaculties}
                        onChange={(e: any) => {
                            setSelectedFaculties(e.target.value)
                            updateSelectedStreams(e.target.value)
                        }}
                        renderValue={(selected: any) => `${selected.length} selected`}
                    >
                        {faculties.map((row) => (
                            <MenuItem key={row?.id} value={row?.id}>
                                <Checkbox size='small'
                                    checked={selectedFaculties.includes(row.id)}
                                />
                                <ListItemText primary={row.name} />
                            </MenuItem>
                        ))}
                    </SelectDropdown>

                </Grid>
                <Grid item xs={12} sm={4}>
                    <SelectDropdown
                        multiple
                        open={false}
                        required
                        fullWidth
                        placeholder="Department"
                        label="Branch/ Stream"
                        onOpen={() => setOpenStreamModal(true)}
                        value={selectedStreams}
                        renderValue={() => `${selectedStreams.length} selected`}
                        disabled={selectedFaculties.length === 0 ? true : false}
                    >
                    </SelectDropdown>
                </Grid>
                {selectedFaculties.length > 0 && <Grid item sm={12}>
                    <Typography variant="subtitle1" gutterBottom>Selected Department & Branches</Typography>
                </Grid>}
                <Grid item sm={12}>
                    {faculties.filter(f => selectedFaculties.includes(f.id)).map((item) => (
                        <>
                            <Box sx={{ display: 'flex', alignItems: "center", mb: 1, gap: 3 }}>
                                <Typography
                                    sx={{ mt: "6px" }}
                                    color="primary"
                                    key={item.id}
                                    variant="subtitle2"
                                    gutterBottom
                                >{item.name}
                                </Typography>
                                <IconButton size='small' onClick={() => onRemoveFaculty(item.id)}><DeleteIcon color="error" fontSize="small" /></IconButton>
                            </Box>
                            <Grid container sx={{ ml: 1 }} spacing={2}>
                                {item.Streams.filter(f => selectedStreams.includes(f.id)).map((val) => (
                                    <Grid item key={val.id} lg={3}> <Typography variant="body2" gutterBottom>{val.streamName}</Typography></Grid>
                                ))}
                            </Grid>
                            {item.Streams.filter(f => selectedStreams.includes(f.id)).length === 0 &&
                                <Typography
                                    sx={{ mt: 1 }}
                                    key={item.id}
                                    variant="subtitle2"
                                    gutterBottom
                                >Not selected any branch
                                </Typography>
                            }
                        </>
                    ))}

                </Grid>
                <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button

                        variant="contained"
                        onClick={() => handleSubmit()}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>

            <StreamInputModal
                open={openStreamModal}
                handleClose={() => setOpenStreamModal(false)}
                selectedStreams={selectedStreams}
                setSelectedStreams={setSelectedStreams}
                selectedFaculties={selectedFaculties}
                faculties={faculties}
            />
        </>
    );
}
