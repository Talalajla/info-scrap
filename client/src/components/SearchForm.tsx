import React, { useEffect, useState } from 'react';
import { searchArticles } from '../services/api';
import { Box, Checkbox, Container, Drawer, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormButtons from './FormButtons';
import { useSnackbar } from 'notistack';
import { WebTemplate } from '../types/types';

interface SearchFormResults {
    onSearchResults: (reuslts: any[]) => void;
}

const SearchForm: React.FC<SearchFormResults> = ({ onSearchResults }) => {
    const { enqueueSnackbar } = useSnackbar();

    const storedCheckboxes = localStorage.getItem('webData_checkboxes');
    const storedRange = localStorage.getItem('webData_range');


    const [webData, setWebData] = useState<WebTemplate>({
        query: '',
        range: 1,
        checkboxABCZdrowie: false,
        checkboxNiebezpiecznik: false,
        checkboxSekurak: false,
        checkboxSevereWeather: false,
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);


    useEffect(() => {
        // Load checkboxes and max depth from localstorage

        if (storedCheckboxes)
            setWebData(prevData => ({ ...prevData, ...JSON.parse(storedCheckboxes) }));

        if (storedRange)
            setWebData(prevData => ({ ...prevData, range: parseInt(storedRange) }))

    }, [])

    useEffect(() => {
        // Move max deapth and checkboxes' status to localstorage 

        localStorage.setItem('webData_checkboxes', JSON.stringify({
            checkboxABCZdrowie: webData.checkboxABCZdrowie,
            checkboxNiebezpiecznik: webData.checkboxNiebezpiecznik,
            checkboxSekurak: webData.checkboxSekurak,
            checkboxSevereWeather: webData.checkboxSevereWeather,
        }));

        localStorage.setItem('webData_range', webData.range.toString());
    }, [webData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;

        const inputValue = type === 'checkbox' ? checked : value;
        setWebData(prevData => ({ ...prevData, [name]: inputValue }));
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const { query, range, checkboxABCZdrowie, checkboxNiebezpiecznik, checkboxSekurak, checkboxSevereWeather } = webData;

        if (query) {
            if (checkboxABCZdrowie || checkboxNiebezpiecznik || checkboxSekurak || checkboxSevereWeather) {

                try {
                    const articles = await searchArticles(query, range, checkboxABCZdrowie, checkboxNiebezpiecznik, checkboxSekurak, checkboxSevereWeather);
                    onSearchResults(articles);
                    if (articles.length > 0) {
                        enqueueSnackbar(`Success, we found ${articles.length} article${articles.length > 1 ? 's' : ''}!`, { variant: 'success' })
                    } else if (articles.length === 0) {
                        enqueueSnackbar('Success, but we got 0 results.', { variant: 'warning' })
                    }
                } catch (e) {
                    enqueueSnackbar('An error occured while searching articles.', { variant: 'error' })
                }
            } else {
                enqueueSnackbar('Select at least 1 source to scrap data.', { variant: 'info' });
            }
        } else {
            enqueueSnackbar('Search input is empty!', { variant: 'info' });
        }

    }

    const handleFilterButtonClick = () => setIsDrawerOpen(!isDrawerOpen);

    return (
        <form onSubmit={handleSearch}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                '@media (max-width: 500px)': {
                    flexDirection: 'column',
                    '>div': {
                        width: '100%',
                        'button': {
                            flex: '1',
                        }
                    }
                }
            }}>
                <TextField
                    variant='outlined'
                    placeholder='What you want to scrap?'
                    type="text"
                    name='query'
                    value={webData.query}
                    onChange={handleInputChange}
                    sx={{ width: '80%', minWidth: '300px' }}
                />

                <FormButtons
                    onFilterButtonClick={handleFilterButtonClick}
                />
            </Box>
            <Drawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                anchor='right'
            >
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: '20px',
                        gap: '5px',
                        padding: '20px',
                        alignItems: 'flex-start'
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '5px' }}>
                        <IconButton onClick={() => setIsDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Typography variant='h4' sx={{ marginBottom: '15px' }}>Select domains to scrap:</Typography>
                    <Box>
                        <Checkbox
                            name='checkboxABCZdrowie'
                            id="cb1"
                            onChange={handleInputChange}
                            checked={webData.checkboxABCZdrowie}
                        />
                        <span>abcZdrowie.pl</span>
                    </Box>
                    <Box>
                        <Checkbox
                            name="checkboxNiebezpiecznik"
                            onChange={handleInputChange}
                            checked={webData.checkboxNiebezpiecznik}
                        />
                        <span>Niebezpiecznik.pl</span>
                    </Box>
                    <Box>
                        <Checkbox
                            name="checkboxSekurak"
                            onChange={handleInputChange}
                            checked={webData.checkboxSekurak}
                        />
                        <span>Sekurak.pl</span>
                    </Box>
                    <Box>
                        <Checkbox
                            name="checkboxSevereWeather"
                            onChange={handleInputChange}
                            checked={webData.checkboxSevereWeather}
                        />
                        <span>severe-weather.eu</span>
                    </Box>
                    <Box sx={{ marginTop: '20px', width: '100%' }}>
                        <Tooltip title={<Typography sx={{ fontSize: '14px' }}>This field specifies the maximum number of pages to search for articles.</Typography>}>
                            <TextField
                                name="range"
                                type="number"
                                onChange={handleInputChange}
                                value={webData.range}
                                label='Max Depth'
                                fullWidth
                            />

                        </Tooltip>
                    </Box>
                </Container>
            </Drawer>
        </form>
    );
}

export default SearchForm;