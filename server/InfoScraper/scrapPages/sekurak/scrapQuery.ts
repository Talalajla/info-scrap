import axios from "axios";
import * as cheerio from 'cheerio';

interface articleData {
    title: string;
    imageSource: string;
    linkHref: string;
    source: string;
}

export async function scrapFromSekurak(query: string, range: number): Promise<any[]> {
    let currentPage = 1;
    const url = `https://sekurak.pl/page/`;
    const shortWebsiteName = 'sekurak.pl';

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

                const imageSource = $(element).find('.onLeft').attr('src');
                const linkHref = $(element).find('h2 > a').attr('href');
                const source = shortWebsiteName

                articlesArray.push({
                    source,
                    title,
                    imageSource,
                    linkHref,
                });
            });

            const goNextPageBtn = $('a.nextpostslink');

            // Stop loop if "go to next page" button is disabled.
            if (!goNextPageBtn && !goNextPageBtn.text().includes('»')) {
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