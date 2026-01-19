import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== Role.ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const jobs = await prisma.jobRun.findMany({
            take: 50,
            orderBy: { startedAt: 'desc' }
        });
        return NextResponse.json(jobs);
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
