import { ExternalIdea } from "./reddit";
import * as cheerio from "cheerio";
import axios from "axios";

export async function fetchWebMetadata(url: string): Promise<ExternalIdea | null> {
    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'IdeaPulse/1.0 (Mozilla/5.0)'
            },
            timeout: 10000
        });

        const $ = cheerio.load(res.data);

        // Extract metadata
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || url;
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "";
        const siteName = $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname;

        return {
            title: title.trim(),
            summary: description.trim(),
            sourceUrl: url,
            sourceId: url, // Use URL as ID for generic web
            author: siteName,
            publishedAt: new Date(), // Hard to get reliable date from generic pages
            metrics: {}
        };

    } catch (e) {
        console.error(`Error fetching web metadata for ${url}`, e);
        return null;
    }
}
