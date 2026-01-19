import { Suspense } from "react";
import { SourcesList } from "./_components/sources-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function SourcesPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Data Sources</h1>
            </div>
            <div className="grid gap-4">
                <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                    <SourcesList />
                </Suspense>
            </div>
        </main>
    );
}
