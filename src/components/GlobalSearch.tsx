import { axiosInstance } from '@/utils/axiosInstance';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Avatar, InputAdornment, InputBase, alpha, styled, Box } from '@mui/material';
import { useState } from 'react';
import Input from './InputComponent';
import { useRouter } from 'next/navigation';

export default function GlobalSearch() {
    const router = useRouter()
    const [value, setValue] = useState("");
    const [options, setOptions] = useState<{ name: string, id: number }[]>([]);
    const [inputValue, setInputValue] = useState('');

    const fetchSuggestions = async (query: string) => {
        if (query) {
            try {
                const response = await axiosInstance.get(`/api/user/search`, {
                    params: {
                        search: query,
                    }
                });
                setOptions(response.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            return []
        }
    };

    const handleInputChange = (event: any, newValue: string) => {
        setInputValue(newValue || "");
        fetchSuggestions(newValue || "");
    };

    const handleValue = (user: any) => {
        if (user.userTypeId === 3) {
            router.push(`/students/${user.itemId}/profile`)
        } else if (user.userTypeId === 2) {
            router.push(`/staff/${user.itemId}/profile`)
        }
    }

    return (
        <>
            <Autocomplete
                sx={{
                    "& .MuiInputBase-root": {
                        padding: "0px !important",
                        borderRadius: "8px"
                    }
                }}
                value={value}
                inputValue={inputValue ?? ""}
                onInputChange={handleInputChange}
                onChange={(event: any, newValue: any) => {
                    handleValue(newValue)
                }}
                handleHomeEndKeys
                options={options}
                getOptionLabel={(option) => {
                    return option?.name ?? "";
                }}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <Avatar
                            src={option.avtarUrl}
                            sx={{ mr: 2 }}
                        />
                        {option.name}
                    </Box>
                )}
                freeSolo
                size={"small"}
                renderInput={(params) => (
                    <Input
                        {...params}
                        sx={{ minWidth: "300px" }}
                        inputSx={{
                            border: "0 !important",
                            padding: "6.5px 4px 6.5px 0px !important",
                        }}
                        placeholder='Search...'
                        required
                        autoComplete="new-password"
                        InputProps={{
                            ...params.InputProps,
                            autoComplete: 'new-password',
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ ml: 1.5 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />
        </>
    )
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(0.5, 1, 0.5, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        border: "1px solid #E1E3E7",
        borderRadius: "8px"
    },
}));