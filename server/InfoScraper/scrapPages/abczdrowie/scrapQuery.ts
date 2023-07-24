import axios from "axios";
import * as cheerio from 'cheerio';

interface articleData {
    title: string;
    imageSource: string;
    linkHref: string;
}

export async function scrapFromABCZdrowie(query: string, range: number): Promise<any[]> {
    let currentPage = 1;
    const url = `https://portal.abczdrowie.pl/szukaj?q=${query}&page=`;

    const articlesArray: articleData[] = [];

    try {
        while (currentPage <= range) {
            const response = await axios.get(`${url}${currentPage}`);
            const html = response.data;
            let $ = cheerio.load(html);

            $('article').each((index, element) => {
                const title = $(element).find('h3').text();

                // Skip article if query does not fit to the title.
                if (!title.toLowerCase().includes(query.toLowerCase()))
                    return;

                const imageSource = $(element).find('.results__unit__image > img').attr('data-src');
                const linkHref = $(element).find('a').attr('href');

                articlesArray.push({
                    title,
                    imageSource,
                    linkHref
                });
            });

            const goNextPageBtn = $('.pagination__link--disabled');

            // Stop loop if "go to next page" button is disabled.
            if (goNextPageBtn && goNextPageBtn.find('.pagination__link__message').text() === 'następna') {
                break;
            }
            currentPage++;
        }

        return articlesArray;

    } catch (err) {
        console.error("Error scraping data: ", err);
        throw new Error('An error occured while scraping data.');
    }
}