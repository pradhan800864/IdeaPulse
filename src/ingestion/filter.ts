/**
 * Logic to filter ideas based on software/technology relevance
 */

const TECH_KEYWORDS = [
    "software", "app", "saas", "platform", "api", "tool", "dashboard", "extension",
    "plugin", "mobile", "web", "ios", "android", "cloud", "server", "database",
    "automation", "integration", "workflow", "developer", "coding", "interface",
    "bot", "ai", "llm", "gpt", "crypto", "blockchain", "b2b", "enterprise",
    "frontend", "backend", "fullstack", "infrastructure", "devops"
];

const EXCLUDE_KEYWORDS = [
    "physical product", "restaurant", "clothing", "real estate", "consulting",
    "agency", "hardware", "medical device", "manufacturing", "logistics"
];

export function isSoftwareProduct(title: string, summary: string = ""): boolean {
    const text = (title + " " + summary).toLowerCase();

    // 1. Check for must-have tech keywords
    const hasTechKeyword = TECH_KEYWORDS.some(k => text.includes(k));

    // 2. Check for exclusion keywords (strong signals of non-software)
    const hasExclusion = EXCLUDE_KEYWORDS.some(k => text.includes(k));

    // Strong indicator if title starts with certain patterns often seen in tech ideas
    const isProbablyTech = /build|app|tool|saas|platform|system/i.test(title);

    // Heuristic: Must have a tech keyword, must NOT have an exclusion keyword, 
    // OR it must strongly look like a tech project from the title.
    if (hasExclusion) return false;

    return hasTechKeyword || isProbablyTech;
}
