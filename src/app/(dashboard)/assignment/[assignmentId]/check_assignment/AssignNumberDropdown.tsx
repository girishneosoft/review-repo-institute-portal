import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

interface AssignNumberDropdownProps {
    value: any,
    onChange: any,
    options: any
}

export default function AssignNumberDropdown({ value, onChange, options }: AssignNumberDropdownProps) {
    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button color={value === 0 ? "error" : "primary"} sx={{ width: 140 }} variant={value !== undefined ? "outlined" : "contained"} size="small" {...bindTrigger(popupState)}>
                        {value !== undefined ? value : "Score"}
                    </Button>
                    <Menu {...bindMenu(popupState)} >
                        {options.map((item: number) => (
                            <MenuItem key={item}
                                onClick={() => {
                                    popupState.close();
                                    onChange(item);
                                }}
                            >{item}</MenuItem>
                        ))}
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    );
}
