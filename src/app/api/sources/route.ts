import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role, SourceType } from "@prisma/client";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== Role.ADMIN) {
        // Allow reading sources for filtering, but maybe hide secrets
        // Actually for now let's restrict sources config viewing to admin, 
        // but reading available sources for UI filters is different (can just use enum).
        // This endpoint is for the Settings/Sources page.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sources = await prisma.sourceConfig.findMany();
    // Ensure all source types are represented even if not in DB
    const allTypes = Object.values(SourceType);
    const result = allTypes.map(type => {
        const existing = sources.find(s => s.source === type);
        return existing || { source: type, enabled: true, apiKey: null, apiSecret: null, lastRunAt: null, lastError: null };
    });

    return NextResponse.json(result);
}
