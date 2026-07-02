"use client";

import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { AssetAssignmentData, AssetCategoryData, AssetItemData, StockItemData, StockTransactionData } from "./inventoryTypes";

const statusOptions = [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }];
const assetStatuses = ["Available", "Assigned", "Maintenance", "Damaged", "Retired"].map((value) => ({ value, label: value }));

interface DialogProps<T> {
    mode: "create" | "edit";
    initialData?: T;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: T) => void;
}

export function CategoryForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit }: DialogProps<AssetCategoryData>) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<AssetCategoryData>({ defaultValues: initialData || { name: "", code: "", type: "Asset", status: "Active" } });
    React.useEffect(() => { if (isOpen) reset(initialData || { name: "", code: "", type: "Asset", status: "Active" }); }, [initialData, isOpen, reset]);
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Category" : "Edit Category"}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <FormInput id="name" label="Name" required error={errors.name?.message} {...register("name", { required: "Name is required" })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="code" label="Code" {...register("code")} />
                        <Controller control={control} name="type" render={({ field }) => <SelectInput label="Type" showNoneOption={false} options={[{ value: "Asset", label: "Asset" }, { value: "Stock", label: "Stock" }, { value: "Both", label: "Both" }]} value={field.value} onChange={field.onChange} />} />
                    </div>
                    <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function AssetForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, categories }: DialogProps<AssetItemData> & { categories: AssetCategoryData[] }) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<AssetItemData>({ defaultValues: initialData || { name: "", assetTag: "", serialNo: "", categoryId: "", purchaseDate: "", purchasePrice: undefined, condition: "", status: "Available" } });
    React.useEffect(() => { if (isOpen) reset(initialData || { name: "", assetTag: "", serialNo: "", categoryId: "", purchaseDate: "", purchasePrice: undefined, condition: "", status: "Available" }); }, [initialData, isOpen, reset]);
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[650px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Asset" : "Edit Asset"}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput id="name" label="Asset Name" required error={errors.name?.message} {...register("name", { required: "Asset name is required" })} /><FormInput id="assetTag" label="Asset Tag" required error={errors.assetTag?.message} {...register("assetTag", { required: "Asset tag is required" })} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput id="serialNo" label="Serial No" {...register("serialNo")} /><Controller control={control} name="categoryId" render={({ field }) => <SelectInput label="Category" options={categories.map((item) => ({ value: item.id || "", label: item.name }))} value={field.value || ""} onChange={field.onChange} />} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><FormInput id="purchaseDate" label="Purchase Date" type="date" {...register("purchaseDate")} /><FormInput id="purchasePrice" label="Purchase Price" type="number" {...register("purchasePrice", { valueAsNumber: true })} /><Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={assetStatuses} value={field.value} onChange={field.onChange} />} /></div>
                    <FormInput id="condition" label="Condition" placeholder="Good, fair, needs repair" {...register("condition")} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function AssignmentForm({ assets, users, rooms, isOpen, isSubmitting, onClose, onSubmit }: { assets: AssetItemData[]; users: any[]; rooms: any[]; isOpen: boolean; isSubmitting?: boolean; onClose: () => void; onSubmit: (data: AssetAssignmentData) => void }) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<AssetAssignmentData>({ defaultValues: { assetId: "", assignedToId: "", roomId: "", issueDate: new Date().toISOString().slice(0, 10), remarks: "" } });
    React.useEffect(() => { if (isOpen) reset({ assetId: "", assignedToId: "", roomId: "", issueDate: new Date().toISOString().slice(0, 10), remarks: "" }); }, [isOpen, reset]);
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[620px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">Assign Asset</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller control={control} name="assetId" render={({ field }) => <SelectInput label="Asset" required searchable showNoneOption={false} options={assets.filter((item) => item.status === "Available").map((item) => ({ value: item.id || "", label: `${item.name} (${item.assetTag})` }))} value={field.value} onChange={field.onChange} error={errors.assetId?.message} />} rules={{ required: "Asset is required" }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller control={control} name="assignedToId" render={({ field }) => <SelectInput label="Assigned User" searchable options={users.map((item) => ({ value: item.id, label: `${item.firstName || ""} ${item.lastName || ""}`.trim() || item.username }))} value={field.value || ""} onChange={field.onChange} />} />
                        <Controller control={control} name="roomId" render={({ field }) => <SelectInput label="Room" searchable options={rooms.map((item) => ({ value: item.id, label: `${item.name} (${item.building})` }))} value={field.value || ""} onChange={field.onChange} />} />
                    </div>
                    <FormInput id="issueDate" label="Issue Date" type="date" required {...register("issueDate", { required: true })} />
                    <FormInput id="remarks" label="Remarks" {...register("remarks")} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Assign"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function StockItemForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, categories }: DialogProps<StockItemData> & { categories: AssetCategoryData[] }) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<StockItemData>({ defaultValues: initialData || { name: "", sku: "", unit: "pcs", categoryId: "", currentQuantity: 0, minQuantity: 0, status: "Active" } });
    React.useEffect(() => { if (isOpen) reset(initialData || { name: "", sku: "", unit: "pcs", categoryId: "", currentQuantity: 0, minQuantity: 0, status: "Active" }); }, [initialData, isOpen, reset]);
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[580px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Stock Item" : "Edit Stock Item"}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput id="name" label="Item Name" required error={errors.name?.message} {...register("name", { required: "Name is required" })} /><FormInput id="sku" label="SKU" {...register("sku")} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput id="unit" label="Unit" {...register("unit")} /><Controller control={control} name="categoryId" render={({ field }) => <SelectInput label="Category" options={categories.map((item) => ({ value: item.id || "", label: item.name }))} value={field.value || ""} onChange={field.onChange} />} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><FormInput id="currentQuantity" label="Current Qty" type="number" {...register("currentQuantity", { valueAsNumber: true })} /><FormInput id="minQuantity" label="Min Qty" type="number" {...register("minQuantity", { valueAsNumber: true })} /><Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} /></div>
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function StockTransactionForm({ stockItems, isOpen, isSubmitting, onClose, onSubmit }: { stockItems: StockItemData[]; isOpen: boolean; isSubmitting?: boolean; onClose: () => void; onSubmit: (data: StockTransactionData) => void }) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<StockTransactionData>({ defaultValues: { stockItemId: "", type: "In", quantity: 1, reference: "", remarks: "", transactionDate: new Date().toISOString().slice(0, 10) } });
    React.useEffect(() => { if (isOpen) reset({ stockItemId: "", type: "In", quantity: 1, reference: "", remarks: "", transactionDate: new Date().toISOString().slice(0, 10) }); }, [isOpen, reset]);
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[560px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl"><DialogTitle className="text-base font-bold text-slate-800">Stock Movement</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller control={control} name="stockItemId" render={({ field }) => <SelectInput label="Stock Item" required searchable showNoneOption={false} options={stockItems.map((item) => ({ value: item.id || "", label: `${item.name} (${item.currentQuantity ?? 0} ${item.unit})` }))} value={field.value} onChange={field.onChange} error={errors.stockItemId?.message} />} rules={{ required: "Stock item is required" }} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Controller control={control} name="type" render={({ field }) => <SelectInput label="Type" showNoneOption={false} options={[{ value: "In", label: "Stock In" }, { value: "Out", label: "Stock Out" }, { value: "Adjustment", label: "Set Quantity" }]} value={field.value} onChange={field.onChange} />} /><FormInput id="quantity" label="Quantity" type="number" required {...register("quantity", { valueAsNumber: true, min: 0.01 })} /><FormInput id="transactionDate" label="Date" type="date" {...register("transactionDate")} /></div>
                    <FormInput id="reference" label="Reference" {...register("reference")} />
                    <FormInput id="remarks" label="Remarks" {...register("remarks")} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl"><Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Record"}</Button></DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
