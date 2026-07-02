"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Title from "@/components/ui/custom-ui/title";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalPage() {
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const canStudent = hasPermission("portal.student.view");
    const canGuardian = hasPermission("portal.guardian.view");

    useEffect(() => {
        if (canStudent) router.replace("/portal/student");
        else if (canGuardian) router.replace("/portal/guardian");
    }, [canGuardian, canStudent, router]);

    return (
        <div className="p-4 space-y-4">
            <Title>Portal</Title>
            <Card className="max-w-xl">
                <CardHeader><CardTitle className="text-base">Choose Portal</CardTitle></CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-3">
                    {canStudent && <Button asChild><Link href="/portal/student">Student Portal</Link></Button>}
                    {canGuardian && <Button asChild variant="outline"><Link href="/portal/guardian">Guardian Portal</Link></Button>}
                    {!canStudent && !canGuardian && <p className="text-sm text-muted-foreground">No portal permission assigned.</p>}
                </CardContent>
            </Card>
        </div>
    );
}
