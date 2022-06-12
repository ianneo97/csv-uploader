import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';

interface HeaderProps {
    value: string;
    value_action: (value: string) => void;
    set_upload_mode: (value: boolean) => void;
}

export default function Header(props: HeaderProps) {
    const { value, value_action, set_upload_mode } = props;

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string
    ) => {
        newAlignment === 'new_upload'
            ? value_action('new_upload')
            : value_action('recent');
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                justifyContent: 'center',
            }}
        >
            <ToggleButtonGroup
                color="primary"
                value={value}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton
                    value="new_upload"
                    onClick={() => set_upload_mode(true)}
                >
                    New Upload
                </ToggleButton>
                <ToggleButton
                    value="recent"
                    onClick={() => set_upload_mode(false)}
                >
                    Recent
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
