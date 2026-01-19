import { ExternalIdea } from "./reddit";

export async function fetchHN(limit = 30): Promise<ExternalIdea[]> {
    // HN API: https://github.com/HackerNews/API
    // New Stories: https://hacker-news.firebaseio.com/v0/newstories.json
    // Item: https://hacker-news.firebaseio.com/v0/item/{id}.json

    try {
        const res = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
        if (!res.ok) return [];

        const ids = await res.json();
        const topIds = ids.slice(0, limit);

        const ideas: ExternalIdea[] = [];

        // Parallel fetch details
        const promises = topIds.map(async (id: number) => {
            try {
                const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                if (!itemRes.ok) return null;
                const item = await itemRes.json();

                if (!item || !item.title) return null;

                // Only interested in "Show HN" or general startup discussions ideally, but we fetch all new
                // We can filter by title keywords loosely if we want, or rely on tagger.

                return {
                    title: item.title,
                    summary: item.text || "", // HN stories often have no text if link, but Ask HN does
                    sourceUrl: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
                    sourceId: String(item.id),
                    author: item.by,
                    publishedAt: new Date(item.time * 1000),
                    metrics: {
                        score: item.score,
                        comments: item.descendants || 0
                    }
                } as ExternalIdea;
            } catch (e) {
                return null;
            }
        });

        const results = await Promise.all(promises);
        return results.filter((r): r is ExternalIdea => r !== null);

    } catch (e) {
        console.error("Error fetching HN", e);
        return [];
    }
}
