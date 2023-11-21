import { Box, Avatar } from "@mui/material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

interface UploadedFilePreviewProps {
    uploadedImage: any,
    clearField?: any
}

export default function UploadedFilePreview({ uploadedImage, clearField }: UploadedFilePreviewProps) {
    return (
        <>
            {uploadedImage &&
                <Box sx={{ position: "relative", height: 75, width: 75 }}>
                    <Avatar
                        src={uploadedImage}
                        variant="square"
                        sx={{ height: 75, width: 75 }}
                    />
                    {clearField && <Box sx={{
                        position: "absolute",
                        top: "-12px",
                        right: "-10px",
                        color: "error.light",
                        background: "#ffffffab",
                        borderRadius: "20px",
                        cursor: "pointer"
                    }}
                        onClick={() => clearField()}
                    >
                        <CloseOutlinedIcon />
                    </Box>}
                </Box >
            }
        </>
    )
}