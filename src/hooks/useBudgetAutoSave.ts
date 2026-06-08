import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Module-level constant — not recreated on every render
const DEBOUNCE_DELAY_MS = 5_000;

/**
 * Debounced auto-save hook for budget allocations.
 *
 * Key design decisions:
 * - `changedAllocationId` is synced into a ref so `debouncedSave` always captures
 *   the *latest* allocation without needing to be recreated on every change.
 * - `isSavingRef` guards against concurrent saves without putting `isSaving` state
 *   in the callback dependency array (which would cause unnecessary recreations).
 * - `onSaveSuccess` is called before `refreshBudgetDetails` so callers can reset
 *   any "unsaved changes" flags before the server data is re-fetched.
 */
export const useBudgetAutoSave = (
    budgetId: number | undefined,
    changedAllocationId: number | null,
    submitSingleAllocation: (accountId: number) => Promise<any>,
    refreshBudgetDetails: () => Promise<void>,
    t: (key: string) => string,
    onSaveSuccess?: () => void,
) => {
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
    // Ref-based guard: prevents concurrent saves without polluting callback deps
    const isSavingRef = useRef(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Always reflect the latest changedAllocationId without recreating debouncedSave
    const changedAllocationIdRef = useRef(changedAllocationId);
    useEffect(() => {
        changedAllocationIdRef.current = changedAllocationId;
    }, [changedAllocationId]);

    const debouncedSave = useCallback(async () => {
        const allocId = changedAllocationIdRef.current;
        if (!budgetId || isSavingRef.current || !allocId) return;

        isSavingRef.current = true;
        setIsSaving(true);
        setSaveError(null);

        try {
            const result = await submitSingleAllocation(allocId);

            if (result?.success) {
                toast.success(result.message || t("changes_saved") || "Changes saved", {
                    duration: 2_000,
                });
                onSaveSuccess?.();
                await refreshBudgetDetails();
            } else {
                const msg = result?.message || t("save_failed") || "Save failed";
                setSaveError(msg);
                toast.error(msg);
            }
        } catch (err: unknown) {
            const fallback = t("save_failed") || "Save failed";
            const msg = err instanceof Error ? err.message || fallback : fallback;
            setSaveError(msg);
            toast.error(msg);
        } finally {
            isSavingRef.current = false;
            setIsSaving(false);
        }
    }, [budgetId, submitSingleAllocation, refreshBudgetDetails, t, onSaveSuccess]);

    const triggerSave = useCallback(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(debouncedSave, DEBOUNCE_DELAY_MS);
    }, [debouncedSave]);

    const cleanup = useCallback(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    }, []);

    return { triggerSave, cleanup, isSaving, saveError };
};
