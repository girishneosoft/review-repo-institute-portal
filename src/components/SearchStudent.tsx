import Input from "@/components/InputComponent"
import { useState } from "react"
import { Controller } from "react-hook-form";
import { axiosInstance } from "@/utils/axiosInstance";
import { Autocomplete, Avatar, Box, TextField } from "@mui/material";


export default function SearchStudent({ onChange, value, size = "small", required = false, label, error, helperText, ...rest }: any) {
    const [options, setOptions] = useState<any>([]);
    const [inputValue, setInputValue] = useState('');

    const fetchSuggestions = async (query: string) => {
        if (query) {
            try {
                const response = await axiosInstance.get(`/api/student/search/${query}`);
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            return []
        }
    };

    const handleInputChange = (event: any, newValue: string) => {
        setInputValue(newValue);
        fetchSuggestions(newValue);
    };

    return (
        <>
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
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar
                            src={option?.User?.avtarUrl}
                            sx={{ mr: 2 }}
                        />
                        {option?.name}
                    </Box>
                )}
                freeSolo
                size={size}
                renderInput={(params) => (
                    <Input
                        {...params}
                        size={size}
                        inputSx={{ borderRight: "0 !important" }}
                        label={label ?? "Search Student"}
                        required
                        error={error}
                        helperText={helperText}
                    />
                )}
            />
        </>
    )
}