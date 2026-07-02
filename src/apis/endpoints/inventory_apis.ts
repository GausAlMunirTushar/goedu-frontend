export const inventoryDashboardUrl = "/inventory/dashboard";

export const inventoryCategoriesUrl = "/inventory/categories";
export const inventoryCategoryDetailUrl = (id: string) => `/inventory/categories/${id}`;

export const inventoryAssetsUrl = "/inventory/assets";
export const inventoryAssetDetailUrl = (id: string) => `/inventory/assets/${id}`;

export const inventoryAssignmentsUrl = "/inventory/assignments";
export const inventoryAssignmentReturnUrl = (id: string) => `/inventory/assignments/${id}/return`;

export const inventoryStockItemsUrl = "/inventory/stock-items";
export const inventoryStockItemDetailUrl = (id: string) => `/inventory/stock-items/${id}`;

export const inventoryStockTransactionsUrl = "/inventory/stock-transactions";
export const inventoryLowStockUrl = "/inventory/reports/low-stock";
