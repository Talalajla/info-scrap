import { Box, Button } from '@mui/material';
import React from 'react';


interface FormButtonsProps {
    onFilterButtonClick: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({ onFilterButtonClick }) => {

    return (
        <Box sx={{ display: 'flex', gap: '5px' }}>
            <Button
                sx={{ display: 'flex', padding: '12px', border: '1px solid #555', height: '100%', borderRadius: '5px' }}
                variant='outlined'
                onClick={onFilterButtonClick}
            >
                <img
                    src="/images/filters.png"
                    alt="Filters"
                    width="30"
                    style={{ maxWidth: '30px', height: 'auto', width: '100%' }}
                />
            </Button>
            <Button type="submit" sx={{ display: 'flex', padding: '12px', border: '1px solid #555', height: '100%', borderRadius: '5px' }} variant='outlined'>
                <img
                    src="/images/search.png"
                    alt="Search"
                    width="30"
                    style={{ maxWidth: '30px', height: 'auto', width: '100%' }}
                />
            </Button>
        </Box>
    )
}

export default FormButtons;