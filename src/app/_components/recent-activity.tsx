import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SourceType } from "@prisma/client";

export async function RecentActivity() {
    const recent = await prisma.idea.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Ingestions</CardTitle>
                <CardDescription>
                    Latest ideas added to the database.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8">
                {recent.map((idea) => (
                    <div className="flex items-center gap-4" key={idea.id}>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none line-clamp-1">
                                {idea.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {idea.source} • {new Date(idea.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                        {/* <div className="ml-auto font-medium">+${item.amount}</div> */} // Maybe score?
                    </div>
                ))}
                {recent.length === 0 && <div className="text-sm text-muted-foreground">No recent activity.</div>}
            </CardContent>
        </Card>
    );
}
