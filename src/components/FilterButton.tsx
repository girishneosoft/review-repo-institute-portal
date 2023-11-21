import SortIcon from '@mui/icons-material/Sort';
import CustomButton from './CustomButton';
import { ButtonProps } from '@mui/material';

interface FilterButtonProps {
    onClick: any;
    count: number;
}

export default function FilterButton({ onClick, count }: FilterButtonProps) {
    return (
        <>
            <CustomButton
                startIcon={<SortIcon sx={{ mt: "-2px" }} />}
                sx={{ pl: 2, pr: 2 }}
                onClick={onClick}
                active={count > 0}
                variant={"outlined"}
            >{count > 0 ? `${count} selected` : 'Filter'}</CustomButton >
        </>
    )
}