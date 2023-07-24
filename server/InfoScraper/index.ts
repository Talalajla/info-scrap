import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { scrapFromABCZdrowie } from "./scrapPages/abczdrowie/scrapQuery";
import { scrapFromNiebezpiecznik } from "./scrapPages/niebezpiecznik/scrapQuery";

const infoScraper: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const query = req.query.q || '';
    const range = parseInt(req.query.range) || 1;
    const cb1 = req.query.cb1 || ''; // Checkbox ABC Zdrowie
    const cb2 = req.query.cb2 || ''; // Checkbox Niebezpiecznik

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