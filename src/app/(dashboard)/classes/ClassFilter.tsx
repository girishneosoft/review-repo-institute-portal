"use client"
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '@/utils/axiosInstance';
import { Grid, MenuItem } from '@mui/material';
import DataGridFilter from '@/components/DataGridFilter';
import SelectDropdown from '@/components/SelectDropdown';
import { InstituteFacultiesProps, InstituteStreamProps } from '@/types';
import FilterButton from '@/components/FilterButton';

interface ClassFilterProps {
    filterOption: any;
    setFilterOption: any;
}

export default function ClassFilter({ filterOption, setFilterOption }: ClassFilterProps) {
    const [openFilter, setOpenFilter] = useState(false)
    const [faculties, setFaculties] = useState<InstituteFacultiesProps[]>([]);
    const [streams, setStreams] = useState<InstituteStreamProps[]>([]);

    const [selectedFaculty, setSelectedFaculty] = useState<number | string>("")
    const [selectedStream, setSelectedStream] = useState<number | string>("")

    useEffect(() => {
        axiosInstance.get("/api/institute/faculties").then((res) => {
            setFaculties(res.data)
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

    const handleClose = (action: boolean) => {
        if (action) {
            setFilterOption({
                instituteFacultyId: selectedFaculty,
                instituteStreamId: selectedStream,
            })
            setOpenFilter(false)
        } else {
            setOpenFilter(false)
        }
    }

    useEffect(() => {
        setSelectedFaculty(filterOption.instituteFacultyId)
    }, [filterOption])

    const onResetFilter = () => {
        setSelectedFaculty("")
        setSelectedStream("")
    }

    return (
        <>
            <FilterButton
                count={Object.values(filterOption).filter(value => value ?? false).length}
                onClick={() => setOpenFilter(true)}
            />

            {openFilter && <DataGridFilter
                open={openFilter}
                handleClose={handleClose}
                maxWidth="sm"
                onResetFilter={onResetFilter}
            >
                <Grid container spacing={2}>
                    <Grid item md={6} sm={12} >
                        <SelectDropdown
                            label="Faculty"
                            defaultValue=""
                            variant="filled"
                            size="small"
                            onChange={(e: any) => setSelectedFaculty(e.target.value)}
                            value={selectedFaculty}
                            clearable={true}
                            onClearInput={() => setSelectedFaculty("")}
                        >
                            {faculties.map((item) => (
                                <MenuItem key={item.facultyId} value={item.facultyId}>{item.name}</MenuItem>
                            ))}
                        </SelectDropdown>
                    </Grid>
                    <Grid item md={6} sm={12}>
                        <SelectDropdown
                            label="Stream"
                            variant="filled"
                            size="small"
                            onChange={(e: any) => setSelectedStream(e.target.value)}
                            value={selectedStream}
                            disabled={selectedFaculty ? false : true}
                            clearable={true}
                            onClearInput={() => setSelectedStream("")}
                        >
                            {streams.map((item) => (
                                <MenuItem key={item.streamId} value={item.streamId}>{item.streamName}</MenuItem>
                            ))}
                        </SelectDropdown>
                    </Grid>
                </Grid>
            </DataGridFilter >}
        </>
    );
}

