import { Box, Button, Grid, styled, Avatar, Paper, IconButton, InputAdornment } from "@mui/material";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Input from '@/components/InputComponent';
import { InstituteProps } from "@/types";
import TextArea from "@/components/TextArea";
import { useEffect, useRef, useState } from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { axiosInstance } from "@/utils/axiosInstance";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { toastMessage } from "@/utils/toastify";
import Loader from '@/components/Loader';
import { useRouter } from "next/navigation";
import Link from "next/link";

const validationSchema = Yup.object({
    instituteName: Yup.string().required('This field is required'),
    instituteUsername: Yup.string().required('This field is required'),
    email: Yup.string().required('This field is required'),
    mobile: Yup.string().required('This field is required'),
    website: Yup.string().required('This field is required'),
    address: Yup.string().required('This field is required'),
    bio: Yup.string().required('This field is required'),
    brochurePath: Yup.mixed(),
});

const BannerImg = styled(Avatar)({
    height: "150px",
    width: "100%",
    bgcolor: "#fafaff"
})

const UploadBannerButton = styled(Button)({
    position: "absolute",
    bottom: "12px",
    right: "12px",
    background: "#fff",
    fontSize: "0.75rem",
    paddingLeft: 15,
    paddingRight: 15,
    "&:hover": {
        background: "#fff",
    },
    "&:focus": {
        background: "#fff",
    },
    "&:active": {
        background: "#fff",
    },
})

const UploadAvtarButton = styled(Button)({
    background: "#fff",
    fontSize: "0.75rem",
    paddingLeft: 15,
    paddingRight: 15,
})

interface ProfileUpdateProps {
    institute: InstituteProps;
    isLoading: boolean;
}


export default function ProfileUpdate({ institute, isLoading }: ProfileUpdateProps) {
    const hiddenAvtarInput = useRef<any>(null);
    const hiddenBannerInput = useRef<any>(null);
    const hiddenBrochureInput = useRef<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const [previewImg, setPreviewImg] = useState({ bannerPath: null, avtarPath: null })

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        setValue("instituteName", institute?.instituteName)
        setValue("instituteUsername", institute?.userName)
        setValue("email", institute?.email)
        setValue("mobile", institute?.mobile)
        setValue("website", institute?.institute?.website)
        setValue("address", institute?.address)
        setValue("bio", institute?.bio)
    }, [institute])

    const onSubmit = (data: any) => {
        setIsSubmitting(true)
        axiosInstance.post("/api/institute/update_profile", data).then((res) => {
            toastMessage(res.data.message, "s")
            setIsSubmitting(false)
            router.push("/edit_profile?t=facultyStream")
        }).catch(() => {
            setIsSubmitting(false)
        })
    }

    const onUploadImage = (e: any, key: string | any) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        setPreviewImg({ ...previewImg, [key]: e.target.files[0] })
        axiosInstance.post("/api/institute/upload_file", formData)
            .then((res) => setValue(key, res.data.fileName))
    }

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && <Grid container spacing={3}>
                <Grid item md={6} sm={12} >
                    <Box component="form" sx={{ mt: 2 }}>

                        <Controller
                            name="instituteName"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Name"
                                    error={!!errors.instituteName}
                                    helperText={errors.instituteName?.message}
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="instituteUsername"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Username"
                                    error={!!errors.instituteUsername}
                                    helperText={errors.instituteUsername?.message}
                                    size="small"
                                />
                            )}
                        />

                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Email"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    size="small"

                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="mobile"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Mobile number"
                                    error={!!errors.mobile}
                                    helperText={errors.mobile?.message}
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="website"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Website"
                                    error={!!errors.website}
                                    helperText={errors.website?.message}
                                    size="small"
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Address location"
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                    size="small"
                                />
                            )}
                        />

                        <Input
                            margin="normal"
                            fullWidth
                            label="Brochure"
                            size="small"
                            value={watch("brochurePath") ?? ""}
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    <IconButton
                                        aria-label="Upload file"
                                        onClick={() => hiddenBrochureInput.current.click()}
                                    >
                                        <input
                                            hidden
                                            type="file"
                                            accept='.pdf,.jpg,.jpeg,.png,.gif'
                                            ref={hiddenBrochureInput}
                                            onChange={(e: any) => onUploadImage(e, "brochurePath")}
                                        />
                                        <FileUploadOutlinedIcon />
                                    </IconButton>
                                </InputAdornment >
                            }}
                        />

                        <Controller
                            name="bio"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Bio"
                                    error={!!errors.bio}
                                    helperText={errors.bio?.message}
                                    size="small"
                                    multiline
                                    rows={4}
                                />
                            )}
                        />
                    </Box>
                </Grid>
                <Grid item md={6} sm={12}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <Box sx={{ mt: 3, position: "relative" }}>
                            <BannerImg
                                src={previewImg?.bannerPath ?
                                    URL.createObjectURL(previewImg?.bannerPath)
                                    : institute?.institute?.bannerPath
                                }
                                variant="rounded"
                            >{institute?.instituteName}</BannerImg>

                            <UploadBannerButton
                                size="small"
                                endIcon={<FileUploadIcon />}
                                onClick={() => hiddenBannerInput.current.click()}
                            >Upload Cover photo</UploadBannerButton>
                            <input
                                hidden
                                type="file"
                                accept='.jpg,.jpeg,.png,.gif'
                                ref={hiddenBannerInput}
                                onChange={(e: any) => onUploadImage(e, "bannerPath")}
                            />
                        </Box>

                        <Box sx={{ p: 2, mt: 4, alignSelf: "center" }} >
                            <Avatar src={previewImg?.avtarPath ?
                                URL.createObjectURL(previewImg?.avtarPath)
                                : institute?.avtarUrl
                            }
                                variant="rounded"
                                sx={{ height: 110, width: 146, mb: 1 }}
                            />
                            <UploadAvtarButton
                                variant="outlined"
                                size="small"
                                endIcon={<FileUploadIcon />}
                                onClick={() => hiddenAvtarInput.current.click()}
                            >Upload Picture</UploadAvtarButton>
                            <input
                                hidden
                                type="file"
                                accept='.jpg,.jpeg,.png,.gif'
                                ref={hiddenAvtarInput}
                                onChange={(e: any) => onUploadImage(e, "avtarPath")}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={6} sm={12}></Grid>
                <Grid item md={6} sm={12}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            // variant="contained"
                            size="small"
                            href="/profile"
                            LinkComponent={Link}
                            sx={{ mr: 1 }}
                        >Cancel</Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleSubmit(onSubmit)}
                        >{isSubmitting ? "Loading..." : "Save & Next"}</Button>
                    </Box>
                </Grid>
            </Grid >}
        </>
    )
}