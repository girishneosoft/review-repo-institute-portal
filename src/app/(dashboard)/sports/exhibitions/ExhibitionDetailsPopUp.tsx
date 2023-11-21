import { Avatar, Dialog, Grid, IconButton, Typography } from "@mui/material"
import { Paper, Box, styled } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { ExhibitionPhotoProps, ExhibitionProps } from "@/types";
import { axiosInstance } from "@/utils/axiosInstance";
import useConfirmation from '@/hooks/useConfirmation';
import { useState } from "react";

interface ExhibitionDetailsPopUpProps {
    open: boolean;
    handleClose: any;
    data: ExhibitionProps;
}

const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "5px 7px",
    color: theme.palette.primary.main
}))

const ExhibitionDetailsPopUp = ({ open, handleClose, data }: ExhibitionDetailsPopUpProps) => {
    const { showAlert, AlertComponent } = useConfirmation();
    const [deletedPhotos, setDeletedPhotos] = useState<number[]>([]);

    const onArchivePhoto = (row: ExhibitionPhotoProps) => {
        showAlert({
            onAction: (status: string) => {
                if (status === "ok") {
                    axiosInstance.delete(`/api/sport/exhibition/photo/${row.id}`, { withCredentials: true }).then((res) => {
                        setDeletedPhotos([...deletedPhotos, row.id])
                    })
                }
            }
        })
    }

    return (
        <>
            <Dialog
                open={open}
                maxWidth={"md"}
                fullWidth={true}
                onClose={handleClose}
            >
                <DialogTitle >
                    Participant
                    <IconButton onClick={() => handleClose(false)} sx={{ position: "absolute", top: 0, right: 0 }} ><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent >
                    <Grid container spacing={5}>
                        <Grid item md={6}>
                            <Paper sx={{ height: "100%", display: "flex", flexDirection: "column", p: 5, alignItems: "center", border: "1px solid #E1E3E7" }}>
                                <Avatar src={data.avtarUrl} sx={{ height: 50, width: 50, mb: 1 }} />
                                <Typography variant="subtitle2">{data.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{data.studentUserName}</Typography>

                                <Paper sx={{ mt: 2 }}>
                                    <Title variant="subtitle2" >
                                        {data.title}
                                    </Title>
                                    <Typography variant="subtitle2" sx={{ color: "#000", p: 1 }}>{data.desc}</Typography>
                                </Paper>
                            </Paper>
                        </Grid>
                        <Grid item md={6}>
                            <Paper sx={{ height: "100%", p: 1, border: "1px solid #E1E3E7" }}>
                                <Typography variant="subtitle2" color="text.secondary">Photos</Typography>
                                {data.photos && data.photos.length === 0 &&
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                        <Typography>No Photos</Typography>
                                    </Box>
                                }
                                <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-start", gap: 1, flexFlow: "row wrap" }}>
                                    {data.photos && data.photos.filter((p) => !deletedPhotos.includes(p.id)).map((item) => (
                                        <Box key={item.id}>
                                            <Box sx={{ position: "relative", }}>
                                                <Avatar
                                                    variant="square"
                                                    src={item.picUrl}
                                                    sx={{ height: 100, width: 100, borderRadius: "9px" }}
                                                />
                                                <Box sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 0,
                                                    color: "error.light",
                                                    background: "#fff",
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                }}
                                                    onClick={() => onArchivePhoto(item)}
                                                >
                                                    <DeleteIcon />
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                </DialogContent>
            </Dialog>

            {AlertComponent}
        </>
    )
}

export default ExhibitionDetailsPopUp;