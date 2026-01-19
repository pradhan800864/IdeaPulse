import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const idea = await prisma.idea.findUnique({
            where: { id },
            include: {
                tags: true,
            }
        });

        if (!idea) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(idea);
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
