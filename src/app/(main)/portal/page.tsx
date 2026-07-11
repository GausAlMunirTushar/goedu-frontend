"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Title from "@/components/ui/custom-ui/title";
import Link from "next/link";

export default function PortalPage() {
    return (
        <div className="p-4 space-y-4">
            <Title>Portal</Title>
            <Card className="max-w-xl">
                <CardHeader><CardTitle className="text-base">Choose Portal</CardTitle></CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-3">
                    <Button asChild><Link href="/portal/student">Student Portal</Link></Button>
                    <Button asChild variant="outline"><Link href="/portal/guardian">Guardian Portal</Link></Button>
                </CardContent>
            </Card>
        </div>
    );
}
