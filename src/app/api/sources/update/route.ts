import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { sourceConfigSchema } from "@/lib/validators";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== Role.ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        // Body should include which source we are updating
        const { source, ...configData } = body;

        if (!source) throw new Error("Source is required");

        // Validate configData part
        const data = sourceConfigSchema.parse(configData);

        const updated = await prisma.sourceConfig.upsert({
            where: { source: source },
            update: data,
            create: {
                source: source,
                ...data
            }
        });

        return NextResponse.json(updated);
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 400 });
    }
}
