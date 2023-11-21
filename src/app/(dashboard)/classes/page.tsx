import React from 'react';
import ClassListing from './ClassListing';
import { axiosInstance } from '@/utils/axiosInstance';

const getInstituteFaculties = async () => {
    const response = await axiosInstance.get("/api/institute/faculties");
    return response.data
}
export default async function Page() {
    const faculties = await getInstituteFaculties();

    return (
        <>
            <ClassListing faculties={faculties} />
        </>
    );
}