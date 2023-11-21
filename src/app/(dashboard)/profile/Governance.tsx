import { Avatar, Box, Paper, Typography } from "@mui/material";
import { InstituteProps } from "@/types";
import moment from "moment";

interface GovernanceProps {
    institute: InstituteProps
}

export default function Governance({ institute }: GovernanceProps) {
    return (
        <>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ mt: 2 }}>
                    <Typography sx={{ color: "primary.main" }}>About us:</Typography>
                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{institute?.institute?.aboutUs ?? "N/A"}</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography sx={{ color: "primary.main" }}>Policy:</Typography>
                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{institute?.institute?.policy ?? "N/A"}</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography sx={{ color: "primary.main" }}>Dean:</Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
                        <Paper>
                            <Box sx={{
                                display: "flex", justifyContent: "space-between", gap: 2, p: 1.5
                            }} >
                                <Box>
                                    <Avatar src="" variant="square" sx={{ height: 60, width: 50 }} />
                                    <Typography component="p" variant="caption" >{institute?.institute?.dean?.name ?? "N/A"}</Typography>
                                </Box>
                                <Box>
                                    <Typography component="p" variant="caption" >Education</Typography>
                                    <Typography component="p" sx={{ color: "text.secondary" }} variant="caption">{institute?.institute?.deanEducation ?? "N/A"}</Typography>
                                    <Typography component="p" variant="caption">From</Typography>
                                    <Typography component="p" sx={{ color: "text.secondary" }} variant="caption">{moment(institute?.institute?.assignDeanDate).format("YYYY")}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{institute?.institute?.desc}</Typography>

                    </Box >
                </Box >
            </Paper >

        </>
    )
}