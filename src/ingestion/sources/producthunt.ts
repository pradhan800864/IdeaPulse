import { ExternalIdea } from "./reddit";

// Product Hunt V2 API requires OAuth token.
// https://api.producthunt.com/v2/docs
// We will only run if PRODUCTHUNT_TOKEN is set.

export async function fetchPh(limit = 10): Promise<ExternalIdea[]> {
    const token = process.env.PRODUCTHUNT_TOKEN;
    if (!token) return [];

    const query = `
    {
      posts(first: ${limit}, order: NEWEST) {
        edges {
          node {
            id
            name
            tagline
            description
            url
            votesCount
            commentsCount
            createdAt
            user {
              name
            }
          }
        }
      }
    }
  `;

    try {
        const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        if (!res.ok) return [];

        const json = await res.json();
        if (json.errors) {
            console.error("PH API Errors", json.errors);
            return [];
        }

        const posts = json.data?.posts?.edges || [];

        return posts.map((edge: any) => {
            const node = edge.node;
            return {
                title: `${node.name} - ${node.tagline}`,
                summary: node.description,
                sourceUrl: node.url,
                sourceId: node.id,
                author: node.user?.name,
                publishedAt: new Date(node.createdAt),
                metrics: {
                    upvotes: node.votesCount,
                    comments: node.commentsCount
                }
            } as ExternalIdea;
        });

    } catch (e) {
        console.error("Error fetching ProductHunt", e);
        return [];
    }
}
