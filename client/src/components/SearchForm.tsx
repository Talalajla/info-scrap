import React, { useState } from 'react';
import { searchArticles } from '../services/api';
import { TextField, Typography } from '@mui/material';

interface SearchFormResults {
    onSearchResults: (reuslts: any[]) => void;
}

interface WebTemplate {
    query: string;
    checkboxABCZdrowie: boolean;
    checkboxNiebezpiecznik: boolean;
    range: number;
}

const SearchForm: React.FC<SearchFormResults> = ({ onSearchResults }) => {
    const [webData, setWebData] = useState<WebTemplate>({
        query: '',
        checkboxABCZdrowie: false,
        checkboxNiebezpiecznik: false,
        range: 1
    });

    const [inputError, setInputError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;

        const inputValue = type === 'checkbox' ? checked : value;
        setWebData(prevData => ({ ...prevData, [name]: inputValue }));
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const { query, range, checkboxABCZdrowie, checkboxNiebezpiecznik } = webData;

        if (query && (checkboxABCZdrowie || checkboxNiebezpiecznik)) {

            const articles = await searchArticles(query, range, checkboxABCZdrowie, checkboxNiebezpiecznik);
            setInputError('');
            onSearchResults(articles)
            console.log(articles)
        } else {
            setInputError('Error, you have to select at least one source');
        }
    }

    return (
        <form onSubmit={handleSearch}>
            <span>{inputError}</span>
            <TextField
                variant='outlined'
                placeholder='Search something...'
                type="text"
                name='query'
                value={webData.query}
                onChange={handleInputChange}
                sx={{ width: '80%', minWidth: '300px' }}
            />
            <Typography variant='body1'>Select domains to scrap:</Typography>
            <label>
                ABCZdrowie
                <input
                    type="checkbox"
                    name='checkboxABCZdrowie'
                    onChange={handleInputChange}
                    checked={webData.checkboxABCZdrowie}
                />
            </label>
            <label>
                Niebezpiecznik
                <input
                    type="checkbox"
                    name="checkboxNiebezpiecznik"
                    onChange={handleInputChange}
                    checked={webData.checkboxNiebezpiecznik}
                />
            </label>
            <label htmlFor="maxPages">
                Max pages to search for articles
                <input
                    type="number"
                    name="range"
                    min='1'
                    step='1'
                    onChange={handleInputChange}
                    value={webData.range}
                    required
                />
            </label>
            <button type="submit">Search</button>
        </form>
    );
}

export default SearchForm;