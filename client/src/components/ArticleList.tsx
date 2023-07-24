import React from 'react';

import { Box, Grid, Link, Typography } from '@mui/material';

interface Article {
    title: string;
    imageSource: string;
    linkHref: string;
}

interface ArticleListProps {
    articles: Article[];
}


const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {

    const articleStyles = {
        width: '100%',
        height: 'auto',
    }

    return (
        <Grid container padding={5} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {articles.map((article, index) => (
                <Grid item key={index} xs={4} sm={4} md={3}>
                    <Box sx={{
                        background: '#212121',
                    }}>
                        <Link href={article.linkHref} target='_blank' rel="noreferrer" sx={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '.85em',
                            letterSpacing: '1px',
                            lineHeight: '1.25em'
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
                                padding: '1em'
                            }}>{article.title}</Typography>
                        </Link>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}

export default ArticleList;