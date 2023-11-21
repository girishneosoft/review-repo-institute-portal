"use client"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useState } from 'react';
import { Button, Box, Grid, IconButton, MenuItem, Avatar } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import { toastMessage } from '@/utils/toastify';
import Input from '@/components/InputComponent';
import SelectDropdown from '@/components/SelectDropdown';
import InputAdornment from '@mui/material/InputAdornment';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useRef } from 'react';
import UploadedFilePreview from '@/components/UploadedFilePreview';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';

const validationSchema = Yup.object({
    itemName: Yup.string().required('This field is required'),
    price: Yup.string().required('This field is required'),
    itemAvtar: Yup.mixed().required('File is required')
        .test('fileType', 'Only image files are allowed', (value: any) => {
            if (!value) return true;
            return ['image/jpeg', 'image/png', 'image/gif'].includes(value?.type);
        }),
});

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [itemType, setItemType] = useState<number>(1);
    const router = useRouter();
    const hiddenFileInput = useRef<any>(null);

    const {
        reset,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        const formData = new FormData();
        Object.keys(data).map(function (key) {
            formData.append(key, data[key]);
        })
        formData.append("itemType", itemType.toString());

        setIsLoading(true)
        axiosInstance.post("/api/canteen/menu/create", formData)
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/canteen/menu');
            }).catch(() => {
                setIsLoading(false)
            })
    }

    const uploadedImage: any = watch('itemAvtar');

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
                <Button
                    LinkComponent={Link}
                    href="/canteen/menu"
                    variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}
                >Back</Button>
            </Box>
            <Paper sx={{ p: 2, height: "100%" }} elevation={0} >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add menu card</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <CustomButton
                            sx={{ pl: 2, pr: 2 }}
                            onClick={() => setItemType(1)}
                            active={itemType === 1}
                        >Snacks</CustomButton>
                        <CustomButton
                            sx={{ pl: 2, pr: 2 }}
                            onClick={() => setItemType(2)}
                            active={itemType === 2}
                        >Lunch</CustomButton>
                    </Box>
                </Box>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item sm={12} md={4}>
                            <Controller
                                name="itemName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Menu name"
                                        autoFocus
                                        error={!!errors.itemName}
                                        helperText={errors.itemName?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={4}>
                            <Controller
                                name="price"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Price"
                                        error={!!errors.price}
                                        helperText={errors.price?.message}

                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={4}>
                            <Controller
                                name="itemAvtar"
                                control={control}
                                defaultValue=""
                                render={({ field }: any) => (
                                    <Input
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Upload Photo"
                                        error={!!errors.itemAvtar}
                                        helperText={errors.itemAvtar?.message}
                                        disabled
                                        value={uploadedImage?.name}
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
                                                        onChange={(e: any) => field.onChange(e?.target?.files[0])}
                                                    />
                                                    <FileUploadOutlinedIcon />
                                                </IconButton>
                                            </InputAdornment >
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12} md={4}>
                            {uploadedImage &&
                                <UploadedFilePreview
                                    uploadedImage={URL.createObjectURL(uploadedImage)}
                                    clearField={() => reset({ itemAvtar: "" })}
                                />
                            }
                        </Grid>

                        <Grid item xs={12} sm={12}>
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
            </Paper >
        </>
    )

}