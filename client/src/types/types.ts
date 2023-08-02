export interface WebTemplate {
    query: string;
    range: number;
    checkboxABCZdrowie: boolean;
    checkboxNiebezpiecznik: boolean;
    checkboxSekurak: boolean;
    checkboxSevereWeather: boolean;
}

export interface Article {
    title: string;
    imageSource: string;
    linkHref: string;
    source: string;
}

export interface ArticleListProps {
    articles: Article[];
    itemsPerPage: number;
}