"use client";

import FormInput from "@/components/form/Input";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import type { HostelAllocationData, HostelBedData, HostelData, HostelLeaveData, HostelRoomData } from "./hostelTypes";

const activeStatusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
];

const bedStatusOptions = [
    { value: "Available", label: "Available" },
    { value: "Occupied", label: "Occupied" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Inactive", label: "Inactive" },
];

interface DialogProps<T> {
    mode: "create" | "edit";
    initialData?: T;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: T) => void;
}

export function HostelForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit }: DialogProps<HostelData>) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<HostelData>({
        defaultValues: initialData || { name: "", code: "", type: "", address: "", wardenName: "", wardenPhone: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", code: "", type: "", address: "", wardenName: "", wardenPhone: "", status: "Active" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[560px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Hostel" : "Edit Hostel"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="name" label="Hostel Name" placeholder="Boys Hostel" required error={errors.name?.message} {...register("name", { required: "Hostel name is required" })} />
                        <FormInput id="code" label="Code" placeholder="BH-01" {...register("code")} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="type" label="Type" placeholder="Boys, Girls, Staff" {...register("type")} />
                        <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={activeStatusOptions} value={field.value} onChange={field.onChange} />} />
                    </div>
                    <FormInput id="address" label="Address" placeholder="Hostel address" {...register("address")} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="wardenName" label="Warden Name" placeholder="Warden" {...register("wardenName")} />
                        <FormInput id="wardenPhone" label="Warden Phone" placeholder="017XXXXXXXX" {...register("wardenPhone")} />
                    </div>
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface RoomFormProps extends DialogProps<HostelRoomData> {
    hostels: HostelData[];
}

export function RoomForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, hostels }: RoomFormProps) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<HostelRoomData>({
        defaultValues: initialData || { hostelId: "", roomNo: "", floor: "", capacity: 1, status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { hostelId: "", roomNo: "", floor: "", capacity: 1, status: "Active" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Room" : "Edit Room"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller control={control} name="hostelId" render={({ field }) => (
                        <SelectInput label="Hostel" required showNoneOption={false} options={hostels.map((item) => ({ value: item.id || "", label: item.name }))} value={field.value} onChange={field.onChange} error={errors.hostelId?.message} />
                    )} rules={{ required: "Hostel is required" }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="roomNo" label="Room No" placeholder="101" required error={errors.roomNo?.message} {...register("roomNo", { required: "Room no is required" })} />
                        <FormInput id="floor" label="Floor" placeholder="1st" {...register("floor")} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="capacity" label="Capacity" type="number" required error={errors.capacity?.message} {...register("capacity", { valueAsNumber: true, min: { value: 1, message: "Capacity must be at least 1" } })} />
                        <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={activeStatusOptions} value={field.value} onChange={field.onChange} />} />
                    </div>
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface BedFormProps extends DialogProps<HostelBedData> {
    hostels: HostelData[];
    rooms: HostelRoomData[];
}

export function BedForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, hostels, rooms }: BedFormProps) {
    const { control, handleSubmit, register, reset, watch, formState: { errors } } = useForm<HostelBedData>({
        defaultValues: initialData || { hostelId: "", roomId: "", bedNo: "", status: "Available" },
    });
    const hostelId = watch("hostelId");
    const roomOptions = rooms.filter((room) => !hostelId || room.hostelId === hostelId);

    React.useEffect(() => {
        if (isOpen) reset(initialData || { hostelId: "", roomId: "", bedNo: "", status: "Available" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Bed" : "Edit Bed"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller control={control} name="hostelId" render={({ field }) => (
                        <SelectInput label="Hostel" required showNoneOption={false} options={hostels.map((item) => ({ value: item.id || "", label: item.name }))} value={field.value} onChange={field.onChange} error={errors.hostelId?.message} />
                    )} rules={{ required: "Hostel is required" }} />
                    <Controller control={control} name="roomId" render={({ field }) => (
                        <SelectInput label="Room" required showNoneOption={false} options={roomOptions.map((item) => ({ value: item.id || "", label: `${item.roomNo} (${item.hostel?.name || ""})` }))} value={field.value} onChange={field.onChange} error={errors.roomId?.message} />
                    )} rules={{ required: "Room is required" }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="bedNo" label="Bed No" placeholder="A-1" required error={errors.bedNo?.message} {...register("bedNo", { required: "Bed no is required" })} />
                        <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={bedStatusOptions} value={field.value} onChange={field.onChange} />} />
                    </div>
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface AllocationFormProps extends DialogProps<HostelAllocationData> {
    students: any[];
    hostels: HostelData[];
    rooms: HostelRoomData[];
    beds: HostelBedData[];
}

export function AllocationForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, students, hostels, rooms, beds }: AllocationFormProps) {
    const { control, handleSubmit, register, reset, watch, formState: { errors } } = useForm<HostelAllocationData>({
        defaultValues: initialData || { studentId: "", hostelId: "", roomId: "", bedId: "", startDate: new Date().toISOString().slice(0, 10), endDate: "", status: "Active", remarks: "" },
    });
    const hostelId = watch("hostelId");
    const roomId = watch("roomId");
    const roomOptions = rooms.filter((room) => !hostelId || room.hostelId === hostelId);
    const bedOptions = beds.filter((bed) => (!hostelId || bed.hostelId === hostelId) && (!roomId || bed.roomId === roomId) && (mode === "edit" || bed.status === "Available"));

    React.useEffect(() => {
        if (isOpen) reset(initialData || { studentId: "", hostelId: "", roomId: "", bedId: "", startDate: new Date().toISOString().slice(0, 10), endDate: "", status: "Active", remarks: "" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[680px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Allocate Student" : "Edit Allocation"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller control={control} name="studentId" render={({ field }) => (
                        <SelectInput label="Student" required searchable disabled={mode === "edit"} showNoneOption={false} options={students.map((item) => ({ value: item.id, label: `${item.fullName || item.name || item.studentId} - ${item.studentId || item.admissionNo || ""}` }))} value={field.value} onChange={field.onChange} error={errors.studentId?.message} />
                    )} rules={{ required: "Student is required" }} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Controller control={control} name="hostelId" render={({ field }) => <SelectInput label="Hostel" required showNoneOption={false} options={hostels.map((item) => ({ value: item.id || "", label: item.name }))} value={field.value} onChange={field.onChange} />} rules={{ required: "Hostel is required" }} />
                        <Controller control={control} name="roomId" render={({ field }) => <SelectInput label="Room" required showNoneOption={false} options={roomOptions.map((item) => ({ value: item.id || "", label: item.roomNo }))} value={field.value} onChange={field.onChange} />} rules={{ required: "Room is required" }} />
                        <Controller control={control} name="bedId" render={({ field }) => <SelectInput label="Bed" required showNoneOption={false} options={bedOptions.map((item) => ({ value: item.id || "", label: `${item.bedNo} (${item.status})` }))} value={field.value} onChange={field.onChange} />} rules={{ required: "Bed is required" }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput id="startDate" label="Start Date" type="date" required error={errors.startDate?.message} {...register("startDate", { required: "Start date is required" })} />
                        <FormInput id="endDate" label="End Date" type="date" {...register("endDate")} />
                        <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={[{ value: "Active", label: "Active" }, { value: "Completed", label: "Completed" }, { value: "Cancelled", label: "Cancelled" }]} value={field.value} onChange={field.onChange} />} />
                    </div>
                    <FormInput id="remarks" label="Remarks" placeholder="Optional note" {...register("remarks")} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface LeaveFormProps {
    allocations: HostelAllocationData[];
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: HostelLeaveData) => void;
}

export function LeaveForm({ allocations, isOpen, isSubmitting, onClose, onSubmit }: LeaveFormProps) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<HostelLeaveData>({
        defaultValues: { allocationId: "", fromDate: new Date().toISOString().slice(0, 10), toDate: new Date().toISOString().slice(0, 10), reason: "", destination: "", guardianPhone: "", status: "Approved" },
    });

    React.useEffect(() => {
        if (isOpen) reset({ allocationId: "", fromDate: new Date().toISOString().slice(0, 10), toDate: new Date().toISOString().slice(0, 10), reason: "", destination: "", guardianPhone: "", status: "Approved" });
    }, [isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">Record Hostel Leave</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller control={control} name="allocationId" render={({ field }) => (
                        <SelectInput label="Resident" required searchable showNoneOption={false} options={allocations.filter((item) => item.status === "Active").map((item) => ({ value: item.id || "", label: `${item.student?.fullName || item.student?.studentId} - ${item.hostel?.name || ""} ${item.room?.roomNo || ""}/${item.bed?.bedNo || ""}` }))} value={field.value} onChange={field.onChange} error={errors.allocationId?.message} />
                    )} rules={{ required: "Resident is required" }} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="fromDate" label="From Date" type="date" required error={errors.fromDate?.message} {...register("fromDate", { required: "From date is required" })} />
                        <FormInput id="toDate" label="To Date" type="date" required error={errors.toDate?.message} {...register("toDate", { required: "To date is required" })} />
                    </div>
                    <FormInput id="reason" label="Reason" placeholder="Reason for leave" required error={errors.reason?.message} {...register("reason", { required: "Reason is required" })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="destination" label="Destination" placeholder="Home address / destination" {...register("destination")} />
                        <FormInput id="guardianPhone" label="Guardian Phone" placeholder="017XXXXXXXX" {...register("guardianPhone")} />
                    </div>
                    <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={[{ value: "Approved", label: "Approved" }, { value: "Pending", label: "Pending" }, { value: "Rejected", label: "Rejected" }]} value={field.value} onChange={field.onChange} />} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Record Leave"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
