import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw, Star, Trash } from "lucide-react";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

export default async function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const idea = await prisma.idea.findUnique({
        where: { id },
        include: { tags: true }
    });

    if (!idea) notFound();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/ideas">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 text-xl font-semibold tracking-tight md:text-2xl truncate">
                    {idea.title}
                </h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Star className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:gap-8">
                <div className="grid gap-4 items-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert">
                                <p>{idea.summary || "No summary available."}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">Score</span>
                                    <span className="text-2xl font-bold">{idea.score.toFixed(1)}</span>
                                </div>
                                {Object.entries((idea.metrics as any) || {}).map(([key, val]) => (
                                    <div className="flex flex-col capitalize" key={key}>
                                        <span className="text-xs text-muted-foreground">{key}</span>
                                        <span className="text-lg font-medium">{String(val)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 items-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Source</span>
                                <Badge variant="outline">{idea.source}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Author</span>
                                <span>{idea.author || '—'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Detected</span>
                                <span>{formatDate(idea.createdAt)}</span>
                            </div>
                            {idea.publishedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Published</span>
                                    <span>{formatDate(idea.publishedAt)}</span>
                                </div>
                            )}
                            <div className="pt-4">
                                <Button className="w-full" asChild>
                                    <a href={idea.sourceUrl} target="_blank" rel="noreferrer">
                                        Visit Source <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {idea.tags.map((tag: any) => (
                                    <Badge key={tag.id} variant="secondary">
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
