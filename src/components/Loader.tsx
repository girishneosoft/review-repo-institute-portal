import { Paper, CircularProgress } from "@mui/material";

interface LoaderProps {
    minHeight?: string | number
}
export default function Loader({ minHeight = "71vh" }: LoaderProps) {
    return (
        <Paper elevation={0} sx={{
            height: "100%",
            width: "100%",
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            minHeight: minHeight,
        }}>
            <CircularProgress />
        </Paper>
    )
}