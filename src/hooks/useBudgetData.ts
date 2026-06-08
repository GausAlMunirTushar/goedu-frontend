import { useState, useEffect, useCallback, useRef } from "react";
import { useBudgetDetailQuery } from "@/apis/queries/finance/budget_queries";

/**
 * Central state manager for a single budget detail view.
 *
 * Responsibilities:
 * - Fetches budget detail (single SWR subscription — no duplicates).
 * - Exposes `refresh` so consumers don't need a second query call.
 * - Tracks draft budget info with an "unsaved changes" guard so a background
 *   refresh after auto-save never overwrites what the user is actively typing.
 *   Call `markInfoSaved()` before triggering a refresh to accept incoming data.
 */
export const useBudgetData = (budgetId?: number, compareIdsCsv?: string) => {
    const [budgetInfoDraft, setBudgetInfoDraft] = useState<any>(null);
    const budgetInfoRef = useRef<any>(null);
    const leafAmountsRef = useRef<Record<number, string>>({});
    const remarksRef = useRef<Record<number, string>>({});

    // Tracks whether the user has made info edits that haven't been confirmed by the server yet.
    const hasUnsavedInfoRef = useRef(false);

    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const [leafAmounts, setLeafAmounts] = useState<Record<number, string>>({});
    const [remarks, setRemarks] = useState<Record<number, string>>({});

    const {
        data: budgetDetailData,
        isLoading: isBudgetDetailLoading,
        mutate,
    } = useBudgetDetailQuery(budgetId, compareIdsCsv);

    const budgetInformations = budgetDetailData?.data;

    /** Revalidate the budget detail query (SWR mutate). */
    const refresh = useCallback(async () => {
        try {
            await mutate();
        } catch (err) {
            console.error("[useBudgetData] refresh failed:", err);
        }
    }, [mutate]);

    // Sync server data into draft — skipped while the user has unsaved edits.
    useEffect(() => {
        if (!budgetInformations) return;
        if (hasUnsavedInfoRef.current) return;

        const initialData = {
            title_en: budgetInformations.title_en ?? "",
            title_bn: budgetInformations.title_bn ?? "",
            description_en: budgetInformations.description_en ?? "",
            description_bn: budgetInformations.description_bn ?? "",
            fiscal_year: budgetInformations.fiscal_year ?? "",
            fiscal_year_name: budgetInformations.fiscal_year_name ?? "",
            revision_number: budgetInformations.revision_number,
            is_approved: budgetInformations.is_approved,
        };

        setBudgetInfoDraft(initialData);
        budgetInfoRef.current = initialData;
    }, [budgetInformations]);

    /**
     * Call after a successful save so the *next* server refresh is accepted
     * and overwrites the draft with confirmed server state.
     */
    const markInfoSaved = useCallback(() => {
        hasUnsavedInfoRef.current = false;
    }, []);

    // Toggle expand/collapse
    const toggle = useCallback((id: number) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);

    // Budget info field change — marks draft as dirty immediately
    const handleBudgetInfoChange = useCallback((field: string, value: any) => {
        hasUnsavedInfoRef.current = true;
        budgetInfoRef.current = { ...(budgetInfoRef.current ?? {}), [field]: value };
        setBudgetInfoDraft((prev: any) => ({ ...(prev ?? {}), [field]: value }));
    }, []);

    const handleLeafChange = useCallback((id: number, raw: string) => {
        leafAmountsRef.current = { ...leafAmountsRef.current, [id]: raw };
        setLeafAmounts((prev) => ({ ...prev, [id]: raw }));
    }, []);

    const handleRemarksChange = useCallback((id: number, value: string) => {
        remarksRef.current = { ...remarksRef.current, [id]: value };
        setRemarks((prev) => ({ ...prev, [id]: value }));
    }, []);

    // Always read from the ref — it is synchronously updated ahead of state
    const getCurrentBudgetInfo = useCallback(() => budgetInfoRef.current, []);
    const getCurrentLeafAmount = useCallback((id: number) => leafAmountsRef.current[id] ?? "", []);
    const getCurrentRemark = useCallback((id: number) => remarksRef.current[id] ?? "", []);

    return {
        budgetInfoDraft,
        budgetInformations,
        isBudgetDetailLoading,
        expanded,
        leafAmounts,
        remarks,
        toggle,
        handleBudgetInfoChange,
        handleLeafChange,
        handleRemarksChange,
        setExpanded,
        setLeafAmounts,
        setRemarks,
        getCurrentBudgetInfo,
        getCurrentLeafAmount,
        getCurrentRemark,
        markInfoSaved,
        refresh,
        budgetInfoRef,
        leafAmountsRef,
        remarksRef,
    };
};
