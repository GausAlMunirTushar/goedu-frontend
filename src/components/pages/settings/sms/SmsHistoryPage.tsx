"use client";

import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSmsHistoryQuery } from "@/apis/queries/sms_queries";

export function SmsHistoryPage() {
    const { data, isLoading } = useSmsHistoryQuery();
    const batches = data?.data?.items || [];
    return (
        <div className="space-y-6 p-6">
            <Title>SMS History</Title>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/60 text-left">
                            <tr>
                                <th className="p-3">Source</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Sent</th>
                                <th className="p-3">Credits</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="p-6 text-center" colSpan={5}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : batches.length === 0 ? (
                                <tr>
                                    <td
                                        className="p-6 text-center text-muted-foreground"
                                        colSpan={5}
                                    >
                                        No SMS history found.
                                    </td>
                                </tr>
                            ) : (
                                batches.map((batch) => (
                                    <tr key={batch.id} className="border-t">
                                        <td className="p-3 capitalize">{batch.sourceType}</td>
                                        <td className="p-3">
                                            <Badge variant="outline">{batch.status}</Badge>
                                        </td>
                                        <td className="p-3">
                                            {batch.successCount}/{batch.validRecipients}
                                        </td>
                                        <td className="p-3">{batch.usedCredits}</td>
                                        <td className="p-3">
                                            {new Date(batch.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
