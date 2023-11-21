"use client"
import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

const buttonStyles = {
    backgroundColor: '#fff',
    border: '1px solid #E1E3E7',
    color: '#90969D'
}

interface CustomButtonProps extends ButtonProps {
    active?: boolean;
}

export default function CustomButton({ onClick, active, children, sx = {}, ...rest }: CustomButtonProps) {
    const buttonRef = React.useRef<any>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        const handleMouseEnter = () => {
            setIsHovered(true);
        };
        const handleMouseLeave = () => {
            setIsHovered(false);
        };

        const buttonElement = buttonRef.current;

        if (buttonElement) {
            buttonElement.addEventListener('mouseenter', handleMouseEnter);
            buttonElement.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            if (buttonElement) {
                buttonElement.removeEventListener('mouseenter', handleMouseEnter);
                buttonElement.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    const buttonStyle = !active && !isHovered ? { ...buttonStyles, ...sx } : sx;

    return (
        <Button
            ref={buttonRef}
            onClick={onClick}
            size="small"
            variant={active ? "contained" : "outlined"}
            sx={buttonStyle}
            {...rest}
        >
            {children}
        </Button>
    );
}
