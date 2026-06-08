import { useMemo, useCallback } from "react";
import { flattenAccountTree } from "@/components/accounting/account-tree/flattenAccountTree";

interface UseBudgetTreeCalculationsProps {
    budgetInformations: any;
    budgetsData: any;
    compareBudgetIds: number[];
    expanded: Record<number, boolean>;
    leafAmounts: Record<number, string>;
    remarks: Record<number, string>;
    mode?: "budget" | "revision";
    hasDeleteColumn?: boolean;
}

export const useBudgetTreeCalculations = ({
    budgetInformations,
    budgetsData,
    compareBudgetIds,
    expanded,
    leafAmounts,
    remarks,
    mode = "revision",
    hasDeleteColumn = false,
}: UseBudgetTreeCalculationsProps) => {
    // Normalize tree data
    const treeData = useMemo(() => {
        const rawTree: any[] = budgetInformations?.allocation_tree ?? [];
        const mapNode = (n: any): any => ({
            ...n,
            balance: String(n.balance ?? n.initial_balance ?? "0.00"),
            children: (n.children ?? []).map(mapNode),
        });
        return rawTree.map(mapNode);
    }, [budgetInformations?.allocation_tree]);

    // Map account id -> "current server amount"
    const balanceMap = useMemo(() => {
        const map: Record<number, string> = {};
        const walk = (nodes: any[]) => {
            for (const n of nodes) {
                map[n.id] = String(n.amount ?? n.balance ?? n.initial_balance ?? "0");
                if (n.children && n.children.length) walk(n.children);
            }
        };
        walk(treeData);
        return map;
    }, [treeData]);

    // Map node id -> raw node
    const nodeMap = useMemo(() => {
        const m: Record<number, any> = {};
        const walk = (nodes: any[]) => {
            for (const n of nodes) {
                m[n.id] = n;
                if (n.children && n.children.length) walk(n.children);
            }
        };
        walk(treeData);
        return m;
    }, [treeData]);

    // Calculate totals
    const totals = useMemo(() => {
        const map: Record<number, number> = {};

        const toNum = (v: any, fallback = 0) => {
            const n = Number(v);
            return Number.isFinite(n) ? n : fallback;
        };

        const compute = (n: any): number => {
            const isLeaf = !n.children || n.children.length === 0;
            if (isLeaf) {
                const raw = leafAmounts[n.id];
                if (raw === undefined || raw.trim() === "") return 0;
                const num = toNum(raw, 0);
                return num;
            }

            const sum = n.children.reduce((acc: number, c: any) => acc + compute(c), 0);
            map[n.id] = sum;
            return sum;
        };

        treeData.forEach((r) => compute(r));
        return map;
    }, [treeData, leafAmounts]);

    // Create rows for table
    const rows = useMemo(() => {
        function normalizeNodes(nodes: any[]): any[] {
            return nodes.map((n) => ({
                id: n.id,
                code: String(n.code ?? ""),
                name_en: String(n.name_en ?? ""),
                name_bn: String(n.name_bn ?? ""),
                account_type_display: String(n.account_type_display ?? ""),
                is_active: Boolean(n.is_active ?? true),
                level: Number(n.level ?? 0),
                children: n.children ? normalizeNodes(n.children) : [],
            }));
        }
        const normalizedTree = normalizeNodes(treeData);
        return flattenAccountTree(normalizedTree, expanded);
    }, [treeData, expanded]);

    // Budget options for comparison
    const budgetOptions = useMemo(() => {
        const budgets = budgetsData ?? [];
        return budgets.map((b: any) => ({
            value: b.id,
            label: b.title_en ?? b.title,
        }));
    }, [budgetsData]);

    // Memoize comparedTrees so downstream memos get a stable reference
    const comparedTrees = useMemo<any[]>(
        () => (budgetInformations?.compared_trees as any[]) ?? [],
        [budgetInformations?.compared_trees],
    );

    // Budget amount map for comparison
    // Reads directly from budgetInformations to avoid stale array references
    const budgetAmountMap = useMemo(() => {
        const map: Record<number, Record<number, string>> = {};
        if (!budgetInformations) return map;

        const baseBudgetId = budgetInformations.id;
        map[baseBudgetId] = {};

        const walkTree = (nodes: any[]) => {
            nodes.forEach((n) => {
                map[baseBudgetId][n.id] = String(n.amount ?? "0.00");
                if (n.children) walkTree(n.children);
            });
        };
        walkTree((budgetInformations.allocation_tree as any[]) ?? []);

        ((budgetInformations.compared_trees as any[]) ?? []).forEach((ct: any) => {
            const bid = ct.budget_id;
            map[bid] = {};
            const walk = (nodes: any[]) => {
                nodes.forEach((n) => {
                    map[bid][n.id] = String(n.amount ?? "0.00");
                    if (n.children) walk(n.children);
                });
            };
            walk(ct.allocation_tree);
        });

        return map;
    }, [budgetInformations]);

    // Dynamic grid columns
    const gridTemplateColumns = useMemo(() => {
        const base = ["minmax(260px,1.6fr)"];
        const compared = comparedTrees.map(() => "minmax(110px,0.7fr)");

        if (mode === "revision") {
            const tail = [
                "minmax(120px,0.7fr)", // current_period_cost
                "minmax(120px,0.7fr)", // total_cost
                "minmax(160px,0.9fr)", // revised_amount
                "minmax(90px,0.4fr)", // increase/decrease
                "minmax(140px,0.9fr)", // remarks
            ];
            return [...base, ...compared, ...tail].join(" ");
        } else {
            // allocation mode
            const tail = [
                "minmax(160px,0.9fr)", // proposed_amount
                "minmax(120px,0.7fr)", // total_cost
                "minmax(140px,0.9fr)", // remarks
            ];

            if (hasDeleteColumn) {
                tail.push("40px"); // action (delete)
            }

            return [...base, ...compared, ...tail].join(" ");
        }
    }, [comparedTrees, mode, hasDeleteColumn]);

    // Also provide the column configuration for headers
    // const columnConfig = useMemo(() => {
    //     if (mode === "revision") {
    //         return {
    //             type: "revision",
    //             headers: [
    //                 { key: "code", label: "code" },
    //                 ...comparedTrees.map((ct) => ({
    //                     key: `compare_${ct.budget_id}`,
    //                     label: "compare_budget",
    //                     budgetId: ct.budget_id,
    //                 })),
    //                 { key: "current_period", label: "proposed_current_period_cost" },
    //                 { key: "total_cost", label: "total_cost" },
    //                 { key: "revised_amount", label: "revised_amount" },
    //                 { key: "diff", label: "increase_decrease" },
    //                 { key: "remarks", label: "remarks" },
    //             ],
    //         };
    //     } else {
    //         return {
    //             type: "allocation",
    //             headers: [
    //                 { key: "code", label: "code" },
    //                 ...comparedTrees.map((ct) => ({
    //                     key: `compare_${ct.budget_id}`,
    //                     label: "compare_budget",
    //                     budgetId: ct.budget_id,
    //                 })),
    //                 { key: "proposed_amount", label: "proposed_amount" },
    //                 { key: "total_cost", label: "total_cost" },
    //                 { key: "remarks", label: "remarks" },
    //                 // Action column would be added by the component based on permissions
    //             ],
    //         };
    //     }
    // }, [comparedTrees, mode]);

    // Helper to get a specific allocation
    const getAllocationForAccount = useCallback(
        (accountId: number) => {
            const raw = leafAmounts[accountId] ?? String(balanceMap[accountId] ?? "");
            const trimmed = String(raw).trim();
            const amount = trimmed === "" ? null : Number(trimmed);

            return {
                account: accountId,
                amount: Number.isFinite(amount) ? amount : null,
                remarks: remarks[accountId] ?? "",
            };
        },
        [leafAmounts, balanceMap, remarks],
    );

    return {
        treeData,
        rows,
        nodeMap,
        totals,
        balanceMap,
        budgetAmountMap,
        comparedTrees,
        budgetOptions,
        gridTemplateColumns,
        // columnConfig,
        getAllocationForAccount,
    };
};
