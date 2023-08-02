import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Box, Grid, Link, Typography, Pagination } from '@mui/material';

interface Article {
    title: string;
    imageSource: string;
    linkHref: string;
    source: string;
}

interface ArticleListProps {
    category: string;
    itemsPerPage: number;
}

const ArticleList_DB: React.FC<ArticleListProps> = ({ category, itemsPerPage }) => {
    const [articlesFromDB, setArticlesFromDB] = useState<Article[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const articleStyles = {
        width: '100%',
        height: 'auto',
    }

    useEffect(() => {
        fetchArticlesFromDatabase(category);
    }, [category]);


    const fetchArticlesFromDatabase = (category: string) => {
        const database = getDatabase();
        const categoryRef = ref(database, category);

        onValue(categoryRef, (snapshot) => {
            const data = snapshot.val();
            const articlesFromDB = data ? Object.values(data) as Article[] : [];
            setArticlesFromDB(articlesFromDB);
        })
    }

    // Pagination calculations
    const indexOfLastArticle = currentPage * itemsPerPage;
    const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
    const currentArticles = articlesFromDB.slice(indexOfFirstArticle, indexOfLastArticle);

    const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    }

    return (
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
                    count={Math.ceil(articlesFromDB.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color='primary'
                    showFirstButton
                    showLastButton
                />
            </Box>
        </>
    );
}

export default ArticleList_DB;