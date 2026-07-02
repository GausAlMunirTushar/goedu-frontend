"use client";

import { useInventoryDashboardQuery, useInventoryLowStockQuery } from "@/apis/queries/inventory_queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { ClipboardList, Database, PackageCheck, Repeat, Settings, TriangleAlert } from "lucide-react";

const stats = [
    { key: "categories", label: "Categories", icon: ClipboardList },
    { key: "assets", label: "Assets", icon: Database },
    { key: "availableAssets", label: "Available Assets", icon: PackageCheck },
    { key: "assignedAssets", label: "Assigned Assets", icon: Repeat },
    { key: "stockItems", label: "Stock Items", icon: Settings },
    { key: "lowStockItems", label: "Low Stock", icon: TriangleAlert },
];

export function InventoryDashboard() {
    const { data: response, isLoading } = useInventoryDashboardQuery();
    const { data: lowStockResponse } = useInventoryLowStockQuery();
    const data = response?.data || {};
    const lowStock = lowStockResponse?.data || [];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <div>
                <Title>Inventory</Title>
                <p className="text-xs text-muted-foreground mt-1">Track assets, assignments, consumable stock, and stock ledger movements.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.key}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-2xl font-semibold text-slate-900 mt-1">{data[stat.key] ?? 0}</p></div>
                                <div className="h-10 w-10 rounded-md bg-lime-50 text-lime-700 flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <Card>
                <CardHeader><CardTitle className="text-base">Low Stock Watch</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {lowStock.slice(0, 6).map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground">{item.currentQuantity} {item.unit} / min {item.minQuantity}</span>
                        </div>
                    ))}
                    {!lowStock.length && <p className="text-sm text-muted-foreground">No low-stock items.</p>}
                </CardContent>
            </Card>
        </div>
    );
}
