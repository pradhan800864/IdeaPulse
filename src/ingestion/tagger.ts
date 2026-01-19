import OpenAI from "openai";

// Simple keyword map for local tagging
const KEYWORD_MAP: Record<string, string[]> = {
    "AI": ["ai ", "gpt", "llm", "intelligence", "machine learning", "neural", "copilot"],
    "SaaS": ["saas", "subscription", "b2b", "enterprise"],
    "DevTools": ["developer", "api", "sdk", "git", "database", "coding", "open source"],
    "E-commerce": ["shopify", "store", "commerce", "retail", "marketplace"],
    "Crypto": ["crypto", "blockchain", "bitcoin", "ethereum", "web3", "token"],
    "Mobile": ["ios", "android", "app", "mobile"],
    "Marketing": ["marketing", "seo", "content", "social media", "ads"],
    "Productivity": ["productivity", "task", "note", "workflow", "automation"],
};

export async function suggestTags(title: string, summary: string = ""): Promise<string[]> {
    const text = (title + " " + summary).toLowerCase();
    const tags = new Set<string>();

    // 1. Local Keyword Match
    for (const [tag, keywords] of Object.entries(KEYWORD_MAP)) {
        if (keywords.some(k => text.includes(k))) {
            tags.add(tag);
        }
    }

    // 2. OpenAI Hook (Optional)
    if (process.env.OPENAI_API_KEY) {
        try {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a startup idea tagger. Return a JSON array of up to 3 relevant tags for the given idea. Do not include explanation." },
                    { role: "user", content: `Title: ${title}\nSummary: ${summary}` }
                ],
                model: "gpt-3.5-turbo",
            });

            const content = completion.choices[0].message.content;
            if (content) {
                try {
                    const suggested = JSON.parse(content);
                    if (Array.isArray(suggested)) {
                        suggested.forEach(t => tags.add(t));
                    }
                } catch (e) {
                    // Fallback if not JSON
                    console.warn("OpenAI returned non-JSON tags", content);
                }
            }
        } catch (e) {
            console.error("OpenAI tagging failed", e);
        }
    }

    return Array.from(tags);
}
