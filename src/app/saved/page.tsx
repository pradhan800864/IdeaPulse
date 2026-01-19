import { IdeasDataTable } from "@/app/ideas/_components/ideas-data-table";

export default function SavedPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Saved Collections</h1>
            </div>
            <div className="text-muted-foreground text-sm">
                Your personal collection of saved ideas.
            </div>
            <div className="rounded-lg border shadow-sm">
                {/* Reusing table for now, would ideally filter by 'saved=true' via API params */}
                <IdeasDataTable />
            </div>
        </main>
    );
}
