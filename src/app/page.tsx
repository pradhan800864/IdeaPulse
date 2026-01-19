import { MetricsCards } from "./_components/metrics-cards";
import { TrendingIdeas } from "./_components/trending-ideas";
import { RecentActivity } from "./_components/recent-activity";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function DashboardPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <Link href="/api/jobs/ingest" prefetch={false}>
                        <Button size="sm" variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync Now
                        </Button>
                    </Link>
                </div>
            </div>

            <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
                <MetricsCards />
            </Suspense>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                    <TrendingIdeas className="xl:col-span-2" />
                </Suspense>

                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                    <RecentActivity />
                </Suspense>
            </div>
        </main>
    );
}
