import { Suspense } from "react";
import { IdeasDataTable } from "./_components/ideas-data-table";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export default function IdeasPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Ideas</h1>
            </div>
            <div className="flex flex-1 rounded-lg border border-dashed shadow-sm" >
                <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                    <IdeasDataTable />
                </Suspense>
            </div>
        </main>
    );
}
