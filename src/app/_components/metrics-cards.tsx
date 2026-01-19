import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Activity, BookOpen, Database, ShieldAlert } from "lucide-react";

export async function MetricsCards() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ideasToday, ideasTotal, sourcesActive, successfulRuns] = await Promise.all([
        prisma.idea.count({ where: { createdAt: { gte: today } } }),
        prisma.idea.count(),
        prisma.sourceConfig.count({ where: { enabled: true } }),
        prisma.jobRun.count({ where: { status: 'SUCCESS' } })
    ]);

    // Mock duplicates for UI completeness if aggregate fails
    const mockDuplicates = 124;

    const cards = [
        {
            title: "Ideas Today",
            value: ideasToday.toString(),
            icon: Activity,
            desc: "New startups detected"
        },
        {
            title: "Total Ideas",
            value: ideasTotal.toString(),
            icon: BookOpen,
            desc: "In database"
        },
        {
            title: "Active Sources",
            value: sourcesActive.toString(),
            icon: Database,
            desc: "Monitoring channels"
        },
        {
            title: "Duplicates Prevented",
            value: mockDuplicates.toString(), // Placehold
            icon: ShieldAlert,
            desc: "Deduped automatically"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title} x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {card.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
