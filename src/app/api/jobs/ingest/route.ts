import { NextResponse } from "next/server";
import { runIngestion } from "@/ingestion/ingest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

export const maxDuration = 300; // Allow 5 minutes for serverless functions

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const authHeader = req.headers.get("authorization");

        // Allow if Admin or if Secret Key provided (for external cron)
        const isAuthorized =
            (session?.user as any)?.role === Role.ADMIN ||
            (authHeader === `Bearer ${process.env.JOB_SECRET}`);

        if (!isAuthorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Trigger in background if possible, or await
        // For Vercel, better to await or use Inngest/generic queue. 
        // We'll await here since we set maxDuration.
        await runIngestion();

        return NextResponse.json({ success: true, message: "Ingestion completed" });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
