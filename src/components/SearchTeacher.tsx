import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Input from './InputComponent';
import { axiosInstance } from '@/utils/axiosInstance';


export default function SearchTeacher({ onChange, value, size = "small", required = false, label, error, helperText, ...rest }: any) {
    const [options, setOptions] = useState<{ name: string, id: number }[]>([]);
    const [inputValue, setInputValue] = useState('');

    const fetchSuggestions = async (query: string) => {
        if (query) {
            try {
                const response = await axiosInstance.get(`/api/teacher/search/${query}`);
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            return []
        }
    };

    const handleInputChange = (event: any, newValue: string) => {
        console.log(newValue, "newValue")
        setInputValue(newValue || "");
        fetchSuggestions(newValue || "");
    };

    return (
        <Autocomplete
            sx={{ "& .MuiInputBase-root": { padding: "0px !important" } }}
            value={value}
            inputValue={inputValue ?? ""}
            onInputChange={handleInputChange}
            onChange={(event, newValue) => {
                console.log(newValue, "newValue")
                onChange && onChange(newValue)
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={options}
            getOptionLabel={(option) => {
                return option?.name ?? "";
            }}
            renderOption={(props, option) => <li {...props}>{option?.name}</li>}
            freeSolo
            size={size}
            renderInput={(params) => (
                <Input
                    {...params}
                    size={size}
                    inputSx={{ borderRight: "0 !important" }}
                    label={label ?? "Assign Teacher"}
                    required={required}
                    error={error}
                    helperText={helperText}
                />
            )}
        />
    );
}

