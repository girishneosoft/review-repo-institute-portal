"use client"
import * as React from 'react';
import { axiosInstance } from '@/utils/axiosInstance';
import { Box, Button } from '@mui/material';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SwitchProfileActivity from '../SwitchProfileActivity';
import { Paper, Typography } from '@mui/material';
import SubjectList from './SubjectList';
import Pending from './Pending';
import Info from './Info';

interface PageProps {
    params: {
        userId: string
    }
}

export default function Page({ params }: PageProps) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <SwitchProfileActivity
                hrefPrimary={`/students/${params.userId}/profile`}
                hrefSecondary={`/students/${params.userId}/class_activities`}
                activePrimary={false}
                activeSecondary={true}
            />

            <Paper elevation={0}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Info" value="1" />
                                <Tab label="Subjects" value="2" />
                                <Tab label="Pending" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Info params={params} />
                        </TabPanel>
                        <TabPanel value="2">
                            <SubjectList params={params} />
                        </TabPanel>
                        <TabPanel value="3">
                            <Pending params={params} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </Paper>
        </>
    )
}