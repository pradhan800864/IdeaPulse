import { prisma } from "@/lib/prisma";
import { fetchReddit } from "./sources/reddit";
import { fetchHN } from "./sources/hn";
import { fetchPh } from "./sources/producthunt";
import { suggestTags } from "./tagger";
import { isSoftwareProduct } from "./filter";
import { SourceType, JobStatus, JobType } from "@prisma/client";
import crypto from "crypto";

// Helper to generate consistent hash
function generateHash(title: string, url: string): string {
    // Normalize: lowercase, remove special chars somewhat
    const normalizedTitle = title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
    const domain = new URL(url).hostname.replace("www.", "");
    const input = `${normalizedTitle}|${domain}`;
    return crypto.createHash("sha256").update(input).digest("hex");
}

export async function runIngestion() {
    const runId = crypto.randomUUID(); // Just for logging context locally, real ID is DB
    console.log(`[Ingestion] Starting run ${runId}`);

    // 1. Create Job Entry
    const job = await prisma.jobRun.create({
        data: {
            type: JobType.INGEST,
            status: JobStatus.RUNNING,
        }
    });

    const stats = { added: 0, updated: 0, skipped: 0, errors: 0 };

    try {
        // 2. Load Configs
        const configs = await prisma.sourceConfig.findMany();
        // Use default enabled if no config present (first run seed implicit or code default)
        // Actually we should rely on what's in DB or default to all if empty.

        // For simplicity, we hardcode enablement check based on SourceType presence or DB config
        const sourcesToRun: SourceType[] = [SourceType.REDDIT, SourceType.HN];
        if (process.env.PRODUCTHUNT_TOKEN) sourcesToRun.push(SourceType.PRODUCTHUNT);

        // Filter by DB config if exists (disable if explicitly set to false)
        // If no config row exists, assume enabled for these defaults.

        for (const source of sourcesToRun) {
            const config = configs.find(c => c.source === source);
            if (config && !config.enabled) continue;

            console.log(`[Ingestion] Fetching ${source}...`);

            let ideas: any[] = [];
            try {
                if (source === SourceType.REDDIT) ideas = await fetchReddit();
                if (source === SourceType.HN) ideas = await fetchHN();
                if (source === SourceType.PRODUCTHUNT) ideas = await fetchPh();
            } catch (e) {
                console.error(`[Ingestion] Error fetching ${source}`, e);
                stats.errors++;
                // Update source config error
                if (config) {
                    await prisma.sourceConfig.update({
                        where: { id: config.id },
                        data: { lastError: String(e) }
                    });
                }
                continue;
            }

            console.log(`[Ingestion] Got ${ideas.length} items from ${source}`);

            // 3. Process Ideas
            for (const item of ideas) {
                // Filter for software/tech products
                if (!isSoftwareProduct(item.title, item.summary)) {
                    console.log(`[Ingestion] Skipping non-software: ${item.title}`);
                    stats.skipped++;
                    continue;
                }

                const hash = generateHash(item.title, item.sourceUrl);

                // Check duplicate
                const existing = await prisma.idea.findFirst({
                    where: {
                        OR: [
                            { hash },
                            { sourceUrl: item.sourceUrl }
                        ]
                    }
                });

                if (existing) {
                    // Update metrics
                    await prisma.idea.update({
                        where: { id: existing.id },
                        data: {
                            metrics: item.metrics,
                            updatedAt: new Date()
                        }
                    });
                    stats.updated++;
                } else {
                    // New items
                    // Get tags
                    const tags = await suggestTags(item.title, item.summary);

                    // Calc basic score
                    const score = (item.metrics.upvotes || item.metrics.score || 0) * 1.0 +
                        (item.metrics.comments || 0) * 0.5 +
                        20; // Recency boost implicit

                    // Create
                    await prisma.idea.create({
                        data: {
                            title: item.title,
                            summary: item.summary,
                            source: source,
                            sourceUrl: item.sourceUrl,
                            sourceId: item.sourceId,
                            author: item.author,
                            publishedAt: item.publishedAt,
                            metrics: item.metrics,
                            hash,
                            score,
                            tags: {
                                connectOrCreate: tags.map(t => ({
                                    where: { name: t },
                                    create: { name: t }
                                }))
                            }
                        }
                    });
                    stats.added++;
                }
            }

            // Update Source Config success
            const now = new Date();
            if (config) {
                await prisma.sourceConfig.update({
                    where: { id: config.id },
                    data: { lastRunAt: now, lastError: null }
                });
            } else {
                // Create default config entry if missing
                await prisma.sourceConfig.create({
                    data: {
                        source,
                        lastRunAt: now
                    }
                });
            }
        }

        // Finish Job
        await prisma.jobRun.update({
            where: { id: job.id },
            data: {
                status: JobStatus.SUCCESS,
                finishedAt: new Date(),
                stats
            }
        });

        console.log(`[Ingestion] Finished. Stats:`, stats);

    } catch (e: any) {
        console.error("[Ingestion] Fatal Error", e);
        await prisma.jobRun.update({
            where: { id: job.id },
            data: {
                status: JobStatus.FAILED,
                finishedAt: new Date(),
                error: e.message || String(e)
            }
        });
    }
}
