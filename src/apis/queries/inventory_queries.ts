import { useQuery } from "@/hooks/useQuery";
import type { TResponse } from "@/types/configs";
import {
    inventoryAssignmentsUrl,
    inventoryAssetsUrl,
    inventoryCategoriesUrl,
    inventoryDashboardUrl,
    inventoryLowStockUrl,
    inventoryStockItemsUrl,
    inventoryStockTransactionsUrl,
} from "../endpoints/inventory_apis";

export const useInventoryDashboardQuery = () => useQuery<TResponse<any>>(inventoryDashboardUrl);
export const useInventoryCategoriesQuery = () => useQuery<TResponse<any>>(inventoryCategoriesUrl);
export const useInventoryAssetsQuery = () => useQuery<TResponse<any>>(inventoryAssetsUrl);
export const useInventoryAssignmentsQuery = () => useQuery<TResponse<any>>(inventoryAssignmentsUrl);
export const useInventoryStockItemsQuery = () => useQuery<TResponse<any>>(inventoryStockItemsUrl);
export const useInventoryStockTransactionsQuery = () => useQuery<TResponse<any>>(inventoryStockTransactionsUrl);
export const useInventoryLowStockQuery = () => useQuery<TResponse<any>>(inventoryLowStockUrl);
