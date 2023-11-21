"use client"
import { Avatar, Box, Grid, IconButton, Typography, styled } from "@mui/material";
import { CompanyProps } from "@/types";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Loader from "@/components/Loader";
import { extractInitials } from "@/utils/genral";

const ArchiveButton = styled(IconButton)({
    top: 0,
    right: 0,
    background: 'white',
    border: '1px solid',
    borderRadius: "5px",
    position: "absolute",
    padding: 1,
    "& :hover, :active, :focus": {
        background: 'white',
    }
})

const Wrapper = styled(Box)({
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    position: "relative",
})

interface CompanyListProps {
    loading: boolean;
    companies: CompanyProps[];
    onArchiveCompany: any;
}

export default function CompanyList({ loading, companies, onArchiveCompany }: CompanyListProps) {
    return (
        <>
            <Typography sx={{ mb: 1 }}>Added partners</Typography>
            {loading && <Loader minHeight={150} />}

            {!loading && companies.length === 0 && <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
                <Typography color="text.secondary">No Partners</Typography>
            </Box>}

            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, overflowX: 'scroll' }}>
                {!loading && companies.map((item) => (
                    <Wrapper key={item.id} sx={{ mb: 2, minWidth: 120 }}>
                        <Avatar
                            sx={{ height: 70, width: 120 }}
                            variant="square" src={item?.companyLogo}
                        >
                            {extractInitials(item?.companyName)}
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ textAlign: "center", color: "primary.main" }}>{item?.companyName}</Typography>
                        <ArchiveButton color="error" size="small" onClick={() => onArchiveCompany(item)}>
                            <DeleteOutlineIcon fontSize="small" />
                        </ArchiveButton>
                    </Wrapper>
                ))}
            </Box>

        </>
    )
}