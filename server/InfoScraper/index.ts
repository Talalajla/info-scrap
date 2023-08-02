import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { scrapFromABCZdrowie } from "./scrapPages/abczdrowie/scrapQuery";
import { scrapFromNiebezpiecznik } from "./scrapPages/niebezpiecznik/scrapQuery";
import { scrapFromSekurak } from "./scrapPages/sekurak/scrapQuery";
import { scrapFromSevereWeather } from "./scrapPages/severeWeather/scrapQuery";

const infoScraper: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const query = req.query.q || '';
    const range = parseInt(req.query.range) || 1;
    const cb1 = req.query.cb1 || ''; // Checkbox abcZdrowie.pl
    const cb2 = req.query.cb2 || ''; // Checkbox Niebezpiecznik.pl
    const cb3 = req.query.cb3 || ''; // Checkbox Sekurak.pl
    const cb4 = req.query.cb4 || ''; // Checkbox Severe-weather.eu

    try {

        // ? Think if splitting to separate files is not an overcoding
        // ? I could use some config file with variables of HTML selectors for every website

        let allArticles = [];

        if (cb1 === 'true') {
            const articlesFromABCZdrowie = await scrapFromABCZdrowie(query, range);
            allArticles.push(...articlesFromABCZdrowie);
        }

        if (cb2 === 'true') {
            const articlesFromNiebezpiecznik = await scrapFromNiebezpiecznik(query, range);
            allArticles.push(...articlesFromNiebezpiecznik);
        }

        if (cb3 === 'true') {
            const articlesFromSekurak = await scrapFromSekurak(query, range);
            allArticles.push(...articlesFromSekurak);
        }

        if (cb4 === 'true') {
            const articlesFromSevereWeather = await scrapFromSevereWeather(query, range);
            allArticles.push(...articlesFromSevereWeather);
        }

        context.res = {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: allArticles,
        };

    } catch (err) {
        console.error("Error scraping data: ", err);
        context.res = {
            status: 500,
            body: "An error occured while scraping data.",
        }
    }
};

export default infoScraper;