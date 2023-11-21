import React, { useRef, useState } from 'react';
import { InputAdornment, Grid, Avatar, IconButton, Box, Typography, Skeleton, CircularProgress, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle, DialogContent } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { axiosInstance } from '@/utils/axiosInstance';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import Input from '@/components/InputComponent';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import UploadedFilePreview from '@/components/UploadedFilePreview';
import TextArea from '@/components/TextArea';

interface CreatePostProps {
    open: boolean;
    handleClose: (status?: boolean) => void;
}

const validationSchema = Yup.object({
    title: Yup.string().required('This field is required'),
    desc: Yup.string().required('This field is required'),
    avtar: Yup.mixed().required('File is required')
        .test('fileType', 'Only image files are allowed', (value: any) => {
            if (!value) return true;
            return ['image/jpeg', 'image/png', 'image/gif'].includes(value?.type);
        }),
});

export default function CreatePost({ open, handleClose }: CreatePostProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [photos, setPhotos] = useState<any[]>([]);

    const hiddenFileInput = useRef<any>(null);

    const {
        reset,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onUploadImage = (e: any) => {
        let _photos: any = [...photos];
        _photos = [..._photos, {
            preview: e.target.files[0],
        }]
        // reset("avtar", "")
        setPhotos(_photos);
    }

    const onSubmit = (data: any) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("desc", data.desc);
        photos.forEach((item, index) => {
            formData.append(`files`, item?.preview, item?.preview?.name);
        });
        setIsLoading(true)
        axiosInstance.post("/api/post/create", formData).then((res) => {
            setIsLoading(false)
            handleClose(true)
        })
    }

    return (
        <div>
            <Dialog
                fullWidth={true}
                open={open}
                maxWidth={"xs"}
                onClose={() => handleClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                    <Typography>Post</Typography>
                    <IconButton aria-label="close" color="error" size="small"
                        sx={{ background: "#F0F3FF" }}
                        onClick={() => handleClose(false)}
                    >
                        <CloseIcon fontSize={"small"} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, position: "relative" }}>
                    <Box component="form" >
                        <Grid container spacing={2} sx={{ p: 2 }}>
                            <Grid item xs={12}>
                                <Controller
                                    name="title"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Title"
                                            autoFocus
                                            error={!!errors.title}
                                            helperText={errors.title?.message}

                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="avtar"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }: any) => (
                                        <Input
                                            {...field}
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Photos"
                                            error={!!errors.avtar}
                                            helperText={errors.avtar?.message}
                                            disabled
                                            value={""}
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>
                                                    <IconButton
                                                        aria-label="Upload file"
                                                        onClick={() => hiddenFileInput.current.click()}
                                                    >
                                                        <input
                                                            hidden
                                                            type="file"
                                                            accept='.jpg,.jpeg,.png,.gif'
                                                            ref={hiddenFileInput}
                                                            onChange={onUploadImage}
                                                        />
                                                        <FileUploadOutlinedIcon />
                                                    </IconButton>
                                                </InputAdornment >
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                                    {photos.map((item: any) => (
                                        <UploadedFilePreview
                                            key={item.fileName}
                                            uploadedImage={URL.createObjectURL(item.preview)}
                                            clearField={() => { }}
                                        />
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="desc"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextArea
                                            {...field}
                                            multiline
                                            margin="normal"
                                            fullWidth
                                            label="About post"
                                            rows={3}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    // sx={{ mt: 3, mb: 2 }}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {isLoading ? "Loading..." : "Submit"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                </DialogContent>
            </Dialog>
        </div >
    );
}
