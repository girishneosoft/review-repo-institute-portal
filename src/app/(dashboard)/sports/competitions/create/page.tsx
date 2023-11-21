"use client"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useState } from 'react';
import { Button, Box, Grid, IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { axiosInstance } from '@/utils/axiosInstance';
import { toastMessage } from '@/utils/toastify';
import Input from '@/components/InputComponent';
import CloseIcon from '@mui/icons-material/Close';
import { useRef } from 'react';
import UploadedFilePreview from '@/components/UploadedFilePreview';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TextArea from '@/components/TextArea';
import InputAdornment from '@mui/material/InputAdornment';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';



const validationSchema = Yup.object({
    desc: Yup.string().required('This field is required'),
});

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [provided, setProvided] = useState<string[]>([]);
    const [banners, setBanners] = useState<any[]>([]);
    const [provide, setProvide] = useState("");
    const router = useRouter();
    const hiddenFileInput = useRef<any>(null);

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = (data: any) => {
        if (provided.length === 0) {
            toastMessage(`Please add "What we provide" and click add button`, "e");
            return
        }
        if (banners.length === 0) {
            toastMessage("Please add some banner image", "e");
            return
        }
        setIsLoading(true)
        const formData = {
            ...data,
            provided: provided,
            banners: banners.map((item) => item.fileName)
        }
        axiosInstance.post("/api/sport/competition/create", formData)
            .then((res) => {
                setIsLoading(false)
                toastMessage(res.data.message, "s")
                router.push('/sports/competitions');
            }).catch(() => {
                setIsLoading(false)
            })
    }

    const removeItem = (indexToRemove: number) => {
        let _provided = [...provided]
        let newArray = _provided.filter((_, index) => index !== indexToRemove);
        setProvided(newArray)
    }

    const onRemoveBannerImage = (indexToRemove: number) => {
        let _banners = [...banners]
        let newArray = _banners.filter((_, index) => index !== indexToRemove);
        setProvided(newArray)
    }

    const onUploadFile = (e: any) => {
        let _banners: any = [...banners];
        const formData = new FormData();

        formData.append("image", e.target.files[0]);

        axiosInstance.post("/api/sport/upload_photo", formData)
            .then((response) => {
                _banners = [...banners, {
                    preview: e.target.files[0],
                    fileName: response?.data?.fileName
                }]
                setBanners(_banners);
                hiddenFileInput.current.value = '';
            })
    }

    return (
        <>

            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}>
                <Button
                    LinkComponent={Link}
                    href="/sports/competitions"
                    variant="outlined" size="small" startIcon={<ArrowBackIosNewOutlinedIcon />}
                >Back</Button>
            </Box>
            <Paper sx={{ p: 2, height: "100%" }} elevation={0}>
                <Typography variant='h6' sx={{ color: "primary.main", mb: 2 }}>Add competition</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item sm={12} md={4}>
                            <Input
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                label="What we provide?"
                                onChange={(e) => setProvide(e.target.value)}
                                value={provide}
                            />
                        </Grid>
                        <Grid item sm={12} md={4} sx={{
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: "flex-start",
                            marginTop: "15px"
                        }}>
                            <Button
                                size="small"
                                variant='contained'
                                onClick={() => {
                                    if (provide) {
                                        setProvided([...provided, provide])
                                        setProvide("")
                                    }
                                }}
                            >Add</Button>
                        </Grid>
                        <Grid item sm={12} md={12} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Grid container columnSpacing={15} rowSpacing={1}>
                                {provided.map((item, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={item}>
                                        <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                                            <Typography>{item}</Typography>
                                            <IconButton onClick={() => removeItem(index)}
                                                color="error" size='small' sx={{ background: "#F0F3FF" }}><CloseIcon fontSize='small' /></IconButton>
                                        </Box>
                                    </Grid>
                                ))}

                            </Grid>
                        </Grid>
                        <Grid item sm={12} md={3}>
                            <Input
                                size="small"
                                margin="normal"
                                fullWidth
                                label="Upload banner photo"
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
                                                onChange={(e: any) => onUploadFile(e)}
                                            />
                                            <FileUploadOutlinedIcon />
                                        </IconButton>
                                    </InputAdornment >
                                }}
                            />
                        </Grid>
                        <Grid item sm={12} md={12}>
                            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                                {banners.map((item, index) => (
                                    <UploadedFilePreview
                                        key={item.fileName}
                                        uploadedImage={URL.createObjectURL(item.preview)}
                                        clearField={() => onRemoveBannerImage(index)}
                                    />
                                ))}
                            </Box>

                        </Grid>

                        <Grid item xs={12} md={12}>
                            <Controller
                                name="desc"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextArea
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Description"
                                        error={!!errors.desc}
                                        helperText={errors.desc?.message}
                                        multiline
                                        rows={4}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item sm={12} md={12} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Button
                                variant="contained"
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