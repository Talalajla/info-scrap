import axios from "axios";

// const BASE_URL = 'http://localhost:7071';
const BASE_URL = 'https://info-scraper.azurewebsites.net';

export const searchArticles = async (query: string, range: number, cb1: boolean, cb2: boolean) => {
    try {
        console.log(`${BASE_URL}/api/InfoScraper?query=${query}&range=${range}&cb1=${cb1.toString()}&cb2=${cb2.toString()}`)
        const response = await axios.get(`${BASE_URL}/api/InfoScraper?q=${query}&range=${range}&cb1=${cb1}&cb2=${cb2}`);
        return response.data;
    } catch (err) {
        console.error('An error occured while searching articles', err);
        return [];
    }
}

export const parseArticle = async (url: string) => {
    const response = await axios.get(`${BASE_URL}/parse?url=${url}`);
    return response.data;
}