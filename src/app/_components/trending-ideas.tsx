import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export async function TrendingIdeas({ className }: { className?: string }) {
    const trending = await prisma.idea.findMany({
        take: 5,
        orderBy: { score: 'desc' },
    });

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Trending Ideas</CardTitle>
                <CardDescription>
                    Top rated ideas from all sources based on engagement.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead className="hidden xl:table-column">Source</TableHead>
                            <TableHead className="hidden xl:table-column">Status</TableHead>
                            <TableHead className="hidden xl:table-column">Date</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trending.map((idea) => (
                            <TableRow key={idea.id}>
                                <TableCell>
                                    <Link href={`/ideas/${idea.id}`} className="font-medium hover:underline">
                                        <div className="line-clamp-1">{idea.title}</div>
                                    </Link>
                                    <div className="hidden text-sm text-muted-foreground md:inline line-clamp-1">
                                        {idea.summary}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    <Badge variant="outline">{idea.source}</Badge>
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    <Badge variant="secondary">{idea.status}</Badge>
                                </TableCell>
                                <TableCell className="hidden xl:table-column">
                                    {formatDate(idea.publishedAt || idea.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">{idea.score.toFixed(1)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
