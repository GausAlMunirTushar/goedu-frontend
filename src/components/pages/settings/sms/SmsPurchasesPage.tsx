"use client";

import Title from "@/components/ui/custom-ui/title";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSmsPurchasesQuery } from "@/apis/queries/sms_queries";

export function SmsPurchasesPage() {
    const { data, isLoading } = useSmsPurchasesQuery();
    const purchases = data?.data || [];
    return (
        <div className="space-y-6 p-6">
            <Title>SMS Purchases</Title>
            <Card>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/60 text-left">
                            <tr>
                                <th className="p-3">Credits</th>
                                <th className="p-3">Unit Price</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Status</th>
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
                            ) : purchases.length === 0 ? (
                                <tr>
                                    <td
                                        className="p-6 text-center text-muted-foreground"
                                        colSpan={5}
                                    >
                                        No purchases found.
                                    </td>
                                </tr>
                            ) : (
                                purchases.map((purchase) => (
                                    <tr key={purchase.id} className="border-t">
                                        <td className="p-3">{purchase.credits}</td>
                                        <td className="p-3">{purchase.unitPrice}</td>
                                        <td className="p-3">{purchase.totalAmount}</td>
                                        <td className="p-3">
                                            <Badge variant="outline">{purchase.status}</Badge>
                                        </td>
                                        <td className="p-3">
                                            {new Date(purchase.createdAt).toLocaleDateString()}
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
