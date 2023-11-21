import React, { Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { Checkbox, FormGroup, FormLabel } from '@mui/material';
import { FacultiesProps } from '@/types';

interface StreamInputModalProps {
    open: boolean,
    selectedFaculties: number[]
    selectedStreams: number[]
    faculties: FacultiesProps[]
    setSelectedStreams: Dispatch<SetStateAction<any[]>>
    handleClose: () => void
}

export default function StreamInputModal({
    open,
    handleClose,
    faculties,
    setSelectedStreams,
    selectedStreams,
    selectedFaculties
}: StreamInputModalProps) {

    const onChangeStream = (value: number) => {
        let _selectedStreams = [...selectedStreams];
        if (selectedStreams.includes(value)) {
            _selectedStreams = _selectedStreams.filter((s) => s !== value)
        } else {
            _selectedStreams = [..._selectedStreams, value]
        }
        setSelectedStreams(_selectedStreams);
    }

    return (
        <Dialog
            fullWidth={false}
            maxWidth={"lg"}
            open={open}
            onClose={handleClose}
        >
            <DialogContent>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content',
                    }}
                >
                    <Box sx={{ display: 'flex' }}>
                        {faculties.filter((f) => selectedFaculties.includes(f.id)).map((item) => (<>
                            <FormControl sx={{ mr: 3 }} component="fieldset" variant="standard">
                                <Typography variant="h6" gutterBottom>
                                    {item.name}
                                </Typography>
                                <FormGroup>
                                    {item.Streams.map((val) => (
                                        <FormControlLabel
                                            key={val.id}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    checked={selectedStreams.includes(val.id)}
                                                    onChange={() => onChangeStream(val.id)}
                                                />
                                            }
                                            label={val.streamName}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </>))}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
        </Dialog >
    )
}