import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateIdeaStatusSchema } from "@/lib/validators";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { status } = updateIdeaStatusSchema.parse(body);

        const idea = await prisma.idea.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(idea);
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 400 });
    }
}
