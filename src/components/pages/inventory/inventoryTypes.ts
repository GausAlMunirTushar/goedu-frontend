export interface AssetCategoryData {
    id?: string;
    name: string;
    code?: string;
    type: string;
    status: string;
}

export interface AssetItemData {
    id?: string;
    name: string;
    assetTag: string;
    serialNo?: string;
    categoryId?: string;
    purchaseDate?: string | null;
    purchasePrice?: number;
    condition?: string;
    status: string;
    category?: AssetCategoryData;
    assignedTo?: any;
    room?: any;
}

export interface AssetAssignmentData {
    id?: string;
    assetId: string;
    assignedToId?: string;
    roomId?: string;
    issueDate: string;
    returnDate?: string | null;
    remarks?: string;
    status?: string;
    asset?: AssetItemData;
    assignedTo?: any;
    room?: any;
}

export interface StockItemData {
    id?: string;
    name: string;
    sku?: string;
    unit: string;
    categoryId?: string;
    currentQuantity?: number;
    minQuantity?: number;
    status: string;
    category?: AssetCategoryData;
}

export interface StockTransactionData {
    id?: string;
    stockItemId: string;
    type: "In" | "Out" | "Adjustment";
    quantity: number;
    previousQuantity?: number;
    newQuantity?: number;
    reference?: string;
    remarks?: string;
    transactionDate?: string;
    stockItem?: StockItemData;
    performedBy?: any;
}
