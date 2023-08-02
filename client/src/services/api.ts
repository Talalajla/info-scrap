import axios from "axios";

// const BASE_URL = 'http://localhost:7071';
const BASE_URL = 'https://info-scraper.azurewebsites.net';

export const searchArticles = async (query: string, range: number, cb1: boolean, cb2: boolean, cb3: boolean, cb4: boolean) => {
    console.log(`calling ${BASE_URL}/api/InfoScraper?query=${query}&range=${range}&cb1=${cb1.toString()}&cb2=${cb2.toString()}&cb3=${cb3.toString()}&cb4=${cb4.toString()}`)

    const response = await axios.get(`${BASE_URL}/api/InfoScraper?q=${query}&range=${range}&cb1=${cb1}&cb2=${cb2}&cb3=${cb3}&cb4=${cb4}`);
    return response.data;
}