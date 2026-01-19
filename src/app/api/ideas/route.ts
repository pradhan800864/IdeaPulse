import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "newest"; // newest, score
    const status = searchParams.get("status") || "NEW";
    const sources = searchParams.get("sources")?.split(',') || [];
    const tags = searchParams.get("tags")?.split(',') || [];

    const where: Prisma.IdeaWhereInput = {
        status: status as any,
        ...(sources.length > 0 && { source: { in: sources as any } }),
        ...(tags.length > 0 && { tags: { some: { name: { in: tags } } } }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { summary: { contains: search, mode: "insensitive" } },
            ]
        })
    };

    const orderBy: Prisma.IdeaOrderByWithRelationInput =
        sort === 'score' ? { score: 'desc' } : { publishedAt: 'desc' };

    try {
        const [ideas, total] = await prisma.$transaction([
            prisma.idea.findMany({
                where,
                take: limit,
                skip: (page - 1) * limit,
                orderBy,
                include: { tags: true }
            }),
            prisma.idea.count({ where })
        ]);

        return NextResponse.json({
            data: ideas,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
