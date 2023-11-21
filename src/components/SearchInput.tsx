"use client"
import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchInput({ onChange, onKeyDown, placeholder, value }: InputBaseProps) {
    return (
        <Paper
            elevation={0}
            sx={{ display: 'flex', alignItems: 'center', border: "1px solid #E1E3E7", height: "33px" }}
        >
            <IconButton aria-label="menu" size='small' sx={{ color: "#90969D", ml: 1 }}>
                <SearchIcon fontSize='small' />
            </IconButton>
            <InputBase
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={value}
                size='small'
                sx={{ ml: 1, flex: 1, fontSize: "14px", ".MuiInputBase-input": { padding: "4px 0 4px !important" } }}
                placeholder={placeholder ? placeholder : "Search"}
                inputProps={{ 'aria-label': 'search google maps' }}
            />
        </Paper>
    );
}