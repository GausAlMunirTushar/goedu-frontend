"use client";

import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSmsWalletQuery } from "@/apis/queries/sms_queries";
import { MessageSquare, Send, Wallet } from "lucide-react";
import Link from "next/link";

export function SmsDashboard() {
    const { data, isLoading } = useSmsWalletQuery();
    const wallet = data?.data?.wallet;
    const recentBatches = data?.data?.recentBatches || [];

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                    <Title>SMS Dashboard</Title>
                    <p className="text-sm text-muted-foreground">
                        Institution SMS balance, usage, and recent activity.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/settings/sms/send">
                        <Send className="size-4" /> Send SMS
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Wallet className="size-4" /> Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">
                        {isLoading ? "..." : wallet?.balance || 0}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Purchased</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">
                        {wallet?.totalPurchased || 0}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Used</CardTitle>
                    </CardHeader>
                    <CardContent className="text-3xl font-bold">
                        {wallet?.totalUsed || 0}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="size-4" /> Recent Sends
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {recentBatches.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No SMS activity yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {recentBatches.map((batch: any) => (
                                <div
                                    key={batch.id}
                                    className="flex justify-between rounded-md border p-3 text-sm"
                                >
                                    <span className="font-medium">{batch.sourceType}</span>
                                    <span>
                                        {batch.successCount}/{batch.validRecipients} sent
                                    </span>
                                    <span>{batch.usedCredits} credits</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
