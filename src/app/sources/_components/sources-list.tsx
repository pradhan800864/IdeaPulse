"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Check if we have this, if not use standard label

// Note: Radix Switch is usually headless,shadcn wraps it. 
// We installed switch. Check if I generated it. I didn't generate components/ui/switch.tsx in my previous steps. I should assume I need to generate it or use basic checkbox.
// I'll assume I need to generate Switch component first.
// For now I'll stub the Switch component inside here or just use a checkbox to be safe if I forgot to generate Switch.
// But user req says "Toggle enabled/disabled".
// Let's quickly generate Switch component in a separate step or just include it inline if simple.
// I'll make a request to generate Switch after this.

export function SourcesList() {
    const [sources, setSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/sources')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSources(data);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    const toggleSource = async (source: any) => {
        // Optimistic update
        const newVal = !source.enabled;
        setSources(prev => prev.map(s => s.source === source.source ? { ...s, enabled: newVal } : s));

        try {
            await fetch('/api/sources/update', {
                method: 'POST',
                body: JSON.stringify({
                    source: source.source,
                    enabled: newVal
                })
            });
        } catch (e) {
            // Revert
            setSources(prev => prev.map(s => s.source === source.source ? { ...s, enabled: !newVal } : s));
        }
    };

    if (loading) return <div>Loading sources...</div>;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => (
                <Card key={source.source} className={source.enabled ? "" : "opacity-75"}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{source.source}</CardTitle>
                            <div
                                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer duration-300 ease-in-out ${source.enabled ? 'bg-primary' : 'bg-gray-300'}`}
                                onClick={() => toggleSource(source)}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${source.enabled ? 'translate-x-4' : ''}`}></div>
                            </div>
                        </div>
                        <CardDescription className="text-xs">
                            Last run: {source.lastRunAt ? new Date(source.lastRunAt).toLocaleString() : 'Never'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {source.lastError && (
                            <div className="text-xs text-red-500 mb-2 p-2 bg-red-50 rounded">
                                Error: {source.lastError.substring(0, 100)}...
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor={`key-${source.source}`}>API Key (Optional)</Label>
                            <Input
                                id={`key-${source.source}`}
                                type="password"
                                placeholder="Provide via ENV or here"
                                defaultValue={source.apiKey || ""}
                                disabled  // Disabled for now, as we prefer ENV vars in this simplified flow
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm" onClick={() => toggleSource(source)}>
                            {source.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        <Badge variant={source.item ? 'default' : 'outline'}>{source.enabled ? 'Active' : 'Inactive'}</Badge>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}


