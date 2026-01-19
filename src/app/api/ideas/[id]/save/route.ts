import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const userId = (session.user as any).id;
        const saved = await prisma.savedIdea.create({
            data: {
                userId,
                ideaId: id
            }
        });
        return NextResponse.json(saved);
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const userId = (session.user as any).id;
        await prisma.savedIdea.delete({
            where: {
                userId_ideaId: {
                    userId,
                    ideaId: id
                }
            }
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 400 });
    }
}
