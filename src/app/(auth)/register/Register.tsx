"use client"

import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Grid, MenuItem } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

import PersonalInformation from './PersonalInformation';
import DepartmentInformation from './DepartmentInformation';
import Link from 'next/link';
import { toastMessage } from '@/utils/toastify';
import { useRouter } from 'next/navigation';
import { FacultiesProps, StateProps } from '@/types';

const validateUsername = async (username: string) => {
    try {
        const response = await axiosInstance.get(`/api/institute/check_username/${username}`);
        const isAvailable = response.data.status;
        if (isAvailable === "available") {
            return true
        }
        return false;
    } catch (error) {
        throw new Error('Username validation failed');
    }
};

const usernameRegex = /^[a-zA-Z0-9_.]+$/;
const validationSchema = Yup.object({
    name: Yup.string().required('This field is required'),
    email: Yup.string().email('Invalid email address').required('This field is required'),
    instituteUsername: Yup.string().required('This field is required')
        .min(8, 'Username must be at least 8 characters')
        .max(40, 'Username must not exceed 40 characters')
        .matches(usernameRegex, 'Username can only contain letters, digits, and underscores'),
    // .test('instituteUsername', 'Username is already taken', async (value) => {
    //     if (value) {
    //         return await validateUsername(value);
    //     }
    //     return true; // Allow empty field; handle required separately
    // }),
    password: Yup.string().required('This field is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character'
        ),
    confirmPassword: Yup.string().required('This field is required')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
});

interface RegisterProps {
    states: StateProps[]
    faculties: FacultiesProps[]
}

export default function Register({ states, faculties }: RegisterProps) {
    const [stateId, setStateId] = useState<number | string>(0);
    const [selectedFaculties, setSelectedFaculties] = useState<number[]>([]);
    const [selectedStreams, setSelectedStreams] = useState<number[]>([]);
    const [activeTab, setActiveTab] = React.useState(1);

    const router = useRouter();
    const [formData, setFormData] = useState([]);
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });



    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        if (parseInt(newValue.toString()) === 2) {
            console.log(newValue, errors, "newValue")
            onSubmitHandler()
        } else {
            setActiveTab(newValue);
        }
    };

    const onSetFormData = (data: any) => {
        setFormData({ ...formData, ...data })
        setActiveTab(2);
    };

    const onSubmitForm = (data: any) => {
        axiosInstance.post("/api/institute/register", { ...formData, ...data })
            .then((res) => {
                toastMessage(res.data.message, "s")
                router.push('/')
            })
    }

    const onSubmitHandler = handleSubmit(onSetFormData);

    return (
        <Box sx={{ typography: 'body1' }}>
            <TabContext value={`${activeTab}`} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Personal information" value="1" />
                        <Tab label="Department(s)" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{ height: "100%" }} >
                    <PersonalInformation
                        errors={errors}
                        control={control}
                        handleSubmit={handleSubmit}
                        onSubmit={onSetFormData}
                        watch={watch}
                    />
                </TabPanel>
                <TabPanel value="2" >
                    <DepartmentInformation
                        stateId={stateId}
                        setStateId={setStateId}
                        selectedFaculties={selectedFaculties}
                        setSelectedFaculties={setSelectedFaculties}
                        selectedStreams={selectedStreams}
                        setSelectedStreams={setSelectedStreams}
                        states={states}
                        faculties={faculties}
                        onSubmit={onSubmitForm} />
                </TabPanel>
            </TabContext>
        </Box>
    );
}
