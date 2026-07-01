"use client";

import {
    adjustSaasSmsBalance,
    createSaasSmsPurchase,
    markSaasSmsPurchasePaid,
} from "@/apis/mutations/sms_mutations";
import {
    useSaasSmsLogsQuery,
    useSaasSmsProviderBalanceQuery,
    useSaasSmsPurchasesQuery,
    useSaasSmsWalletsQuery,
} from "@/apis/queries/sms_queries";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function SaasSmsAdminPage() {
    const { data: walletsData, mutate: mutateWallets } = useSaasSmsWalletsQuery();
    const { data: purchasesData, mutate: mutatePurchases } = useSaasSmsPurchasesQuery();
    const { data: logsData } = useSaasSmsLogsQuery();
    const { data: providerData, mutate: mutateProvider } = useSaasSmsProviderBalanceQuery();
    const wallets = walletsData?.data || [];
    const purchases = purchasesData?.data || [];
    const logs = logsData?.data || [];
    const [institutionId, setInstitutionId] = useState("");
    const [credits, setCredits] = useState(1000);
    const [unitPrice, setUnitPrice] = useState(0.35);
    const [adjustment, setAdjustment] = useState(0);
    const selectedInstitution = useMemo(
        () => wallets.find((item: any) => item.id === institutionId),
        [wallets, institutionId],
    );

    const refresh = () => {
        mutateWallets();
        mutatePurchases();
    };

    const createPurchase = async () => {
        if (!institutionId || credits <= 0) return toast.error("Select institution and credits");
        await createSaasSmsPurchase({ institutionId, credits, unitPrice });
        toast.success("SMS purchase created");
        refresh();
    };

    const adjust = async () => {
        if (!institutionId || adjustment === 0)
            return toast.error("Select institution and adjustment credits");
        await adjustSaasSmsBalance({
            institutionId,
            credits: adjustment,
            note: "Manual SaaS adjustment",
        });
        toast.success("Balance adjusted");
        setAdjustment(0);
        refresh();
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between gap-3">
                <div>
                    <Title>SaaS SMS Admin</Title>
                    <p className="text-sm text-muted-foreground">
                        Manage institution SMS wallets, top-ups, provider balance, and logs.
                    </p>
                </div>
                <Button variant="outline" onClick={() => mutateProvider()}>
                    Provider Balance: {providerData?.data?.balance || "Check"}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create Top-up / Adjustment</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-5">
                    <select
                        className="rounded-md border px-3 py-2 text-sm md:col-span-2"
                        value={institutionId}
                        onChange={(e) => setInstitutionId(e.target.value)}
                    >
                        <option value="">Select institution</option>
                        {wallets.map((item: any) => (
                            <option key={item.id} value={item.id}>
                                {item.name} ({item.smsWallet?.balance || 0})
                            </option>
                        ))}
                    </select>
                    <Input
                        type="number"
                        value={credits}
                        onChange={(e) => setCredits(Number(e.target.value))}
                        placeholder="Credits"
                    />
                    <Input
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                        placeholder="Unit price"
                    />
                    <Button onClick={createPurchase}>Create Purchase</Button>
                    <Input
                        type="number"
                        value={adjustment}
                        onChange={(e) => setAdjustment(Number(e.target.value))}
                        placeholder="Adjustment +/-"
                    />
                    <Button variant="outline" onClick={adjust} disabled={!selectedInstitution}>
                        Adjust Balance
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Institution Wallets</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-auto p-0">
                        {wallets.map((item: any) => (
                            <div
                                key={item.id}
                                className="flex justify-between border-t p-3 text-sm"
                            >
                                <span>{item.name}</span>
                                <span>{item.smsWallet?.balance || 0} credits</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Purchases</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-96 overflow-auto p-0">
                        {purchases.map((purchase) => (
                            <div
                                key={purchase.id}
                                className="flex items-center justify-between gap-3 border-t p-3 text-sm"
                            >
                                <span>{purchase.institution?.name || purchase.institutionId}</span>
                                <span>{purchase.credits} credits</span>
                                <Badge variant="outline">{purchase.status}</Badge>
                                {purchase.status !== "Paid" && (
                                    <Button
                                        size="sm"
                                        onClick={async () => {
                                            await markSaasSmsPurchasePaid(purchase.id);
                                            toast.success("Purchase credited");
                                            refresh();
                                        }}
                                    >
                                        Mark Paid
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent SMS Logs</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-auto p-0">
                    {logs.map((log: any) => (
                        <div key={log.id} className="grid grid-cols-5 gap-2 border-t p-3 text-sm">
                            <span>{log.institution?.name}</span>
                            <span className="capitalize">{log.sourceType}</span>
                            <span>
                                {log.successCount}/{log.validRecipients}
                            </span>
                            <span>{log.usedCredits} credits</span>
                            <Badge variant="outline">{log.status}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
