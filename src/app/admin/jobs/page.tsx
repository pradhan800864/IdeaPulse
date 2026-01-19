import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
    const jobs = await prisma.jobRun.findMany({
        take: 20,
        orderBy: { startedAt: 'desc' }
    });

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Job Runs</h1>
                <Link href="/api/jobs/ingest">
                    <Button size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Trigger Ingestion
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Started</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Stats</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.map(job => (
                                <TableRow key={job.id}>
                                    <TableCell>
                                        <Badge variant={job.status === 'SUCCESS' ? 'default' : job.status === 'RUNNING' ? 'secondary' : 'destructive'}>
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{job.type}</TableCell>
                                    <TableCell>{job.startedAt.toLocaleString()}</TableCell>
                                    <TableCell>
                                        {job.finishedAt ?
                                            `${(job.finishedAt.getTime() - job.startedAt.getTime()) / 1000}s`
                                            : 'running...'}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {JSON.stringify(job.stats)}
                                        {job.error && <div className="text-red-500 truncate max-w-[200px]">{job.error}</div>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}
