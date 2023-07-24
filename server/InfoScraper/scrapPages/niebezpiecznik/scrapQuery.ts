import axios from "axios";
import * as cheerio from 'cheerio';

interface articleData {
    title: string;
    imageSource: string;
    linkHref: string;
}

export async function scrapFromNiebezpiecznik(query: string, range: number): Promise<any[]> {
    let currentPage = 1;
    const url = `https://niebezpiecznik.pl/page/`;

    const articlesArray: articleData[] = [];

    try {
        while (currentPage <= range) {
            const response = await axios.get(`${url}${currentPage}`);
            const html = response.data;
            let $ = cheerio.load(html);

            $('.post').each((index, element) => {
                const title = $(element).find('h2 > a').text();

                // Skip article if query does not fit to the title.
                if (!title.toLowerCase().includes(query.toLowerCase()))
                    return;

                const imageSource = $(element).find('.wp-post-image').attr('src');
                const linkHref = $(element).find('h2 > a').attr('href');

                articlesArray.push({
                    title,
                    imageSource,
                    linkHref
                });
            });

            const goNextPageBtn = $('div.left a');

            // Stop loop if "go to next page" button is disabled.
            if (!goNextPageBtn && !goNextPageBtn.text().includes('starsze')) {
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