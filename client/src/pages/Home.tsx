import React, { useState } from 'react';

import SearchForm from '../components/SearchForm';
import ArticleList from '../components/ArticleList';
import { Box, Typography } from '@mui/material';


const Home: React.FC = () => {
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearchResults = (results: any[]) => {
        setSearchResults(results);
    }

    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant='h1' sx={{ fontSize: '3em', padding: '1em 0' }}>&#60;info-scrap /&#62;</Typography>
            <SearchForm onSearchResults={handleSearchResults} />
            <ArticleList articles={searchResults} />
        </Box>
    );
}

export default Home;