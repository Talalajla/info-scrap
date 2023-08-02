import React, { useState } from 'react';

import { Box, Grid, Link, Pagination, Typography } from '@mui/material';
import { ArticleListProps } from '../types/types';


const ArticleList: React.FC<ArticleListProps> = ({ articles, itemsPerPage }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const articleStyles = {
        width: '100%',
        height: 'auto',
    }

    // Pagination calculations
    const indexOfLastArticle = currentPage * itemsPerPage;
    const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    }

    return (
        <>
            {articles.length > 0
                ? (
                    <>
                        <Grid container padding={5} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {currentArticles.map((article, index) => (
                                <Grid item key={index} xs={4} sm={4} md={4}>
                                    <Box sx={{
                                        background: '#212121',
                                        position: 'relative',
                                    }}>
                                        <Link href={article.linkHref} target='_blank' rel="noreferrer" sx={{
                                            color: '#fff',
                                            textDecoration: 'none',
                                            fontSize: '.85em',
                                            letterSpacing: '1px',
                                            lineHeight: '1.25em',
                                        }}>
                                            <img
                                                src={article.imageSource}
                                                alt={article.title}
                                                width='200'
                                                height='100'
                                                style={articleStyles}
                                            />
                                            <Typography variant='h4' sx={{
                                                fontSize: '1.35em',
                                                padding: '1em 15px'
                                            }}>{article.title}</Typography>
                                            <Typography variant='h5' sx={{ fontSize: '1em', padding: '1em 15px' }}>
                                                Source: {article.source}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px 0 40px' }}>
                            <Pagination
                                count={Math.ceil(articles.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color='primary'
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    </>
                )
                : (
                    <Box className='emptyData' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src="/images/notes.svg" alt="Empty Notes" />
                        <Typography variant='h4'>It's so empty here... search for some articles!</Typography>
                    </Box>
                )
            }
        </>
    );
}

export default ArticleList;