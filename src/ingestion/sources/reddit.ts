import { Idea } from "@prisma/client";

export interface ExternalIdea {
    title: string;
    summary?: string;
    sourceUrl: string;
    sourceId: string;
    author?: string;
    publishedAt: Date;
    metrics: any;
}

export async function fetchReddit(limit = 25): Promise<ExternalIdea[]> {
    // Uses public JSON endpoint if no API key, or OAuth if key provided (simplified for "public API" req)
    // We'll use the public .json trick for simplicity as a default fallback, 
    // but if env vars are present, we could do auth.

    // Endpoints: /r/SaaS/new.json, /r/sideproject/new.json, /r/AppIdeas/new.json
    const subreddits = ['SaaS', 'sideproject', 'AppIdeas'];
    const allIdeas: ExternalIdea[] = [];

    for (const sub of subreddits) {
        try {
            const res = await fetch(`https://www.reddit.com/r/${sub}/new.json?limit=${limit}`, {
                headers: {
                    'User-Agent': process.env.REDDIT_USER_AGENT || 'IdeaPulse/1.0',
                }
            });

            if (!res.ok) {
                console.error(`Failed to fetch reddit /r/${sub}: ${res.statusText}`);
                continue;
            }

            const data = await res.json();
            const posts = data.data.children;

            const ideas = posts.map((p: any) => {
                const post = p.data;
                return {
                    title: post.title,
                    summary: post.selftext?.substring(0, 500) || "",
                    sourceUrl: `https://www.reddit.com${post.permalink}`,
                    sourceId: post.id,
                    author: post.author,
                    publishedAt: new Date(post.created_utc * 1000),
                    metrics: {
                        upvotes: post.ups,
                        comments: post.num_comments,
                    }
                };
            });

            allIdeas.push(...ideas);
        } catch (e) {
            console.error(`Error fetching reddit /r/${sub}`, e);
        }
    }

    return allIdeas;
}
