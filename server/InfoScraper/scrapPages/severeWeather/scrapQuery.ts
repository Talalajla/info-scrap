import axios from "axios";
import * as cheerio from 'cheerio';

interface articleData {
    title: string;
    imageSource: string;
    linkHref: string;
    source: string;
}

export async function scrapFromSevereWeather(query: string, range: number): Promise<any[]> {
    let currentPage = 1;
    const url = `https://www.severe-weather.eu/page/`;
    const shortWebsiteName = 'severe-weather.eu';

    const articlesArray: articleData[] = [];

    try {
        while (currentPage <= range) {
            const response = await axios.get(`${url}${currentPage}`);
            const html = response.data;
            let $ = cheerio.load(html);

            $('article').each((index, element) => {
                const title = $(element).find('h2 > a').text();

                // Skip article if query does not fit to the title.
                if (!title.toLowerCase().includes(query.toLowerCase()))
                    return;

                const imageSource = $(element).find('.size-mv_trellis_1x1_low_res').attr('src');
                const linkHref = $(element).find('h2 > a').attr('href');
                const source = shortWebsiteName

                articlesArray.push({
                    source,
                    title,
                    imageSource,
                    linkHref,
                });
            });

            const goNextPageBtn = $('.next_posts>a');

            // Stop loop if "go to next page" button is disabled.
            if (!goNextPageBtn && !goNextPageBtn.text().includes('Older →')) {
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