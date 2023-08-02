import React, { useState } from 'react';

import SearchForm from '../components/SearchForm';
import ArticleList from '../components/ArticleList';
import { Box, Button, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { getDatabase, ref, push, set, get } from "firebase/database";
import ArticleListDB from '../components/ArticleList_DB';
import { useSnackbar } from 'notistack';

const Home: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [currentArticlesSiteIndex, setCurrentArticlesSiteIndex] = useState<number>(0);
    const [isVisibleDBArticles, setIsVisibleDBArticles] = useState<boolean>(false);

    const handleSearchResults = (results: any[]) => {
        setSearchResults(results);
        setCurrentTabIndex(1)
    }

    const handleTabChange = (e: React.ChangeEvent<{}>, tabIndex: number) => setCurrentTabIndex(tabIndex);
    const handleDatabaseSiteChange = (e: React.ChangeEvent<{}>, tabIndex: number) => setCurrentArticlesSiteIndex(tabIndex);

    const handleUpdateDatabase = async (cat: string, url: string) => {
        try {
            const database = getDatabase();
            const category = cat;

            const snapshot = await get(ref(database, category));
            const existingArticles = snapshot.val() || {};

            const filteredArticles = searchResults.filter((res) => res.source === url);

            const articlesToAdd = filteredArticles.filter((article) => {
                for (const key in existingArticles) {
                    if (existingArticles[key].linkHref === article.linkHref) {
                        return false;
                    }
                }
                return true
            });


            for (const article of articlesToAdd) {
                const articleDataRef = push(ref(database, category));
                const articleDataKey = articleDataRef.key;
                await set(ref(database, `${category}/${articleDataKey}`), article);
            }

            enqueueSnackbar('Articles have been successfully added to the database.', { variant: 'success' });

        } catch (e) {
            enqueueSnackbar('There was a problem when adding articles to the database.', { variant: 'error' });
            console.error(e);
        }
    }

    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant='h1' sx={{ fontSize: '3em', padding: '1em 0' }}>&#60;info-scrap /&#62;</Typography>
            <SearchForm onSearchResults={handleSearchResults} />
            {searchResults.length > 0 && (
                <>
                    <Typography sx={{ padding: '15px 15px 10px' }} variant='h6'>We got <strong>{searchResults.length}</strong> results:</Typography>
                    {searchResults.filter((res) => res.source === 'niebezpiecznik.pl') && (
                        <Box className='results-row' sx={{ display: 'flex', gap: '5px', alignItems: 'center', margin: '10px 0' }}>
                            <Typography variant='h5' sx={{ width: '25px', fontSize: '20px', margin: '0 30px' }}>({searchResults.filter((res) => res.source === 'niebezpiecznik.pl').length})</Typography>
                            <Tooltip title={<Typography sx={{ fontSize: '1.5em' }}>Add new articles to the database</Typography>}>
                                <Button sx={{ fontWeight: '700' }} variant='contained' color='secondary' onClick={() => handleUpdateDatabase('niebezpiecznik', 'niebezpiecznik.pl')}>Update DB</Button>
                            </Tooltip>
                            <span>&#8722; niebezpiecznik.pl</span>
                        </Box>
                    )}
                    {searchResults.filter((res) => res.source === 'abczdrowie.pl') && (
                        <Box className='results-row' sx={{ display: 'flex', gap: '5px', alignItems: 'center', margin: '10px 0' }}>
                            <Typography variant='h5' sx={{ width: '25px', fontSize: '20px', margin: '0 30px' }}>({searchResults.filter((res) => res.source === 'abczdrowie.pl').length})</Typography>
                            <Tooltip title={<Typography sx={{ fontSize: '1.5em' }}>Add new articles to the database</Typography>}>
                                <Button sx={{ fontWeight: '700' }} variant='contained' color='secondary' onClick={() => handleUpdateDatabase('abczdrowie', 'abczdrowie.pl')}>Update DB</Button>
                            </Tooltip>
                            <span>&#8722; abczdrowie.pl</span>
                        </Box>
                    )}
                    {searchResults.filter((res) => res.source === 'sekurak.pl') && (
                        <Box className='results-row' sx={{ display: 'flex', gap: '5px', alignItems: 'center', margin: '10px 0' }}>
                            <Typography variant='h5' sx={{ width: '25px', fontSize: '20px', margin: '0 30px' }}>({searchResults.filter((res) => res.source === 'sekurak.pl').length})</Typography>
                            <Tooltip title={<Typography sx={{ fontSize: '1.5em' }}>Add new articles to the database</Typography>}>
                                <Button sx={{ fontWeight: '700' }} variant='contained' color='secondary' onClick={() => handleUpdateDatabase('sekurak', 'sekurak.pl')}>Update DB</Button>
                            </Tooltip>
                            <span>&#8722; sekurak.pl</span>
                        </Box>
                    )}
                    {searchResults.filter((res) => res.source === 'severe-weather.eu') && (
                        <Box className='results-row' sx={{ display: 'flex', gap: '5px', alignItems: 'center', margin: '10px 0' }}>
                            <Typography variant='h5' sx={{ width: '25px', fontSize: '20px', margin: '0 30px' }}>({searchResults.filter((res) => res.source === 'severe-weather.eu').length})</Typography>
                            <Tooltip title={<Typography sx={{ fontSize: '1.5em' }}>Add new articles to the database</Typography>}>
                                <Button sx={{ fontWeight: '700' }} variant='contained' color='secondary' onClick={() => handleUpdateDatabase('severe-weather', 'severe-weather.eu')}>Update DB</Button>
                            </Tooltip>
                            <span>&#8722; severe-weather.eu</span>
                        </Box>
                    )}
                </>
            )}
            <Tabs
                value={currentTabIndex}
                onChange={handleTabChange}
                indicatorColor='secondary'
                textColor='secondary'
                aria-label='Tabs with articles selection'
                variant='fullWidth'
                sx={{ margin: '2em 0' }}
            >
                <Tab label='Database' title='Articles from Database' sx={{ fontSize: '1.25em', fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }} />
                <Tab label='Scraper' title='Scraped articles' sx={{ fontSize: '1.25em', fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }} />
            </Tabs>
            {currentTabIndex === 0 && (
                isVisibleDBArticles
                    ?
                    <>
                        <Tabs
                            value={currentArticlesSiteIndex}
                            onChange={handleDatabaseSiteChange}
                            indicatorColor='secondary'
                            textColor='secondary'
                            aria-label='Tabs with web URLs'
                            variant='scrollable'
                            scrollButtons='auto'
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                margin: '1em 0'
                            }}
                        >
                            <Tab label='Niebezpiecznik' sx={{ fontSize: '1em', fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }} />
                            <Tab label='abcZdrowie' sx={{ fontSize: '1em', fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }} />
                            <Tab label='Sekurak' sx={{ fontSize: '1em', fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }} />
                            <Tab label='Severe-weather' sx={{ fontSize: '1em', fontFamily: 'Montserrat, sans-serif', fontWeight: '500' }} />
                        </Tabs>
                        {currentArticlesSiteIndex === 0 && (
                            <ArticleListDB category='niebezpiecznik' itemsPerPage={12} />
                        )}
                        {currentArticlesSiteIndex === 1 && (
                            <ArticleListDB category='abczdrowie' itemsPerPage={12} />
                        )}
                        {currentArticlesSiteIndex === 2 && (
                            <ArticleListDB category='sekurak' itemsPerPage={12} />
                        )}
                        {currentArticlesSiteIndex === 3 && (
                            <ArticleListDB category='severe-weather' itemsPerPage={12} />
                        )}
                    </>
                    :
                    <Box sx={{ width: '100%', minHeight: '400px', display: 'grid', placeItems: 'center' }}>
                        <Tooltip title='Articles are ready to be shown, just press the button'>
                            <Button
                                onClick={() => setIsVisibleDBArticles(true)}
                                color='secondary'
                                sx={{ fontSize: '1.5em', letterSpacing: '1px', padding: '.75em 1.5em' }}
                                variant='contained'
                            >Load articles</Button>
                        </Tooltip>
                    </Box>
            )
            }
            {currentTabIndex === 1 && (
                <ArticleList articles={searchResults} itemsPerPage={12} />
            )}
        </Box>
    );
}

export default Home;