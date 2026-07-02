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
import type {
    TransportAssignmentData,
    TransportDriverData,
    TransportRouteData,
    TransportStopData,
    TransportVehicleData,
} from "./transportTypes";

const statusOptions = [
    { value: "Active", label: "Active" },
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

export function VehicleForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit }: DialogProps<TransportVehicleData>) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<TransportVehicleData>({
        defaultValues: initialData || { name: "", registrationNo: "", type: "", capacity: 1, status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", registrationNo: "", type: "", capacity: 1, status: "Active" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Vehicle" : "Edit Vehicle"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <FormInput id="name" label="Vehicle Name" placeholder="School Bus 01" required error={errors.name?.message} {...register("name", { required: "Vehicle name is required" })} />
                    <FormInput id="registrationNo" label="Registration No" placeholder="DHA-METRO-11-1234" required error={errors.registrationNo?.message} {...register("registrationNo", { required: "Registration number is required" })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="type" label="Type" placeholder="Bus, microbus" {...register("type")} />
                        <FormInput id="capacity" label="Capacity" type="number" required error={errors.capacity?.message} {...register("capacity", { valueAsNumber: true, min: { value: 1, message: "Capacity must be at least 1" } })} />
                    </div>
                    <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function DriverForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit }: DialogProps<TransportDriverData>) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<TransportDriverData>({
        defaultValues: initialData || { name: "", phone: "", licenseNo: "", address: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", phone: "", licenseNo: "", address: "", status: "Active" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Driver" : "Edit Driver"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <FormInput id="name" label="Driver Name" placeholder="Md. Rahim" required error={errors.name?.message} {...register("name", { required: "Driver name is required" })} />
                    <FormInput id="phone" label="Phone" placeholder="017XXXXXXXX" required error={errors.phone?.message} {...register("phone", { required: "Phone is required" })} />
                    <FormInput id="licenseNo" label="License No" placeholder="Optional" {...register("licenseNo")} />
                    <FormInput id="address" label="Address" placeholder="Current address" {...register("address")} />
                    <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface RouteFormProps extends DialogProps<TransportRouteData> {
    vehicles: TransportVehicleData[];
    drivers: TransportDriverData[];
}

export function RouteForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, vehicles, drivers }: RouteFormProps) {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm<TransportRouteData>({
        defaultValues: initialData || { name: "", code: "", vehicleId: "", driverId: "", status: "Active" },
    });

    React.useEffect(() => {
        if (isOpen) reset(initialData || { name: "", code: "", vehicleId: "", driverId: "", status: "Active" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[560px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Add Route" : "Edit Route"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="name" label="Route Name" placeholder="Mirpur Route" required error={errors.name?.message} {...register("name", { required: "Route name is required" })} />
                        <FormInput id="code" label="Code" placeholder="R-01" {...register("code")} />
                    </div>
                    <Controller control={control} name="vehicleId" render={({ field }) => <SelectInput label="Vehicle" options={vehicles.map((item) => ({ value: item.id || "", label: `${item.name} (${item.registrationNo})` }))} value={field.value || ""} onChange={field.onChange} />} />
                    <Controller control={control} name="driverId" render={({ field }) => <SelectInput label="Driver" options={drivers.map((item) => ({ value: item.id || "", label: `${item.name} (${item.phone})` }))} value={field.value || ""} onChange={field.onChange} />} />
                    <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} />
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface StopFormProps {
    route?: TransportRouteData;
    isOpen: boolean;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (data: TransportStopData) => void;
}

export function StopForm({ route, isOpen, isSubmitting, onClose, onSubmit }: StopFormProps) {
    const { handleSubmit, register, reset, formState: { errors } } = useForm<TransportStopData>({
        defaultValues: { name: "", pickupTime: "", dropTime: "", monthlyFee: undefined, sortOrder: 0 },
    });

    React.useEffect(() => {
        if (isOpen) reset({ name: "", pickupTime: "", dropTime: "", monthlyFee: undefined, sortOrder: (route?.stops?.length || 0) + 1 });
    }, [isOpen, reset, route]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[520px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">Add Stop: {route?.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <FormInput id="name" label="Stop Name" placeholder="College Gate" required error={errors.name?.message} {...register("name", { required: "Stop name is required" })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="pickupTime" label="Pickup Time" type="time" {...register("pickupTime")} />
                        <FormInput id="dropTime" label="Drop Time" type="time" {...register("dropTime")} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput id="monthlyFee" label="Monthly Fee" type="number" {...register("monthlyFee", { valueAsNumber: true })} />
                        <FormInput id="sortOrder" label="Sort Order" type="number" {...register("sortOrder", { valueAsNumber: true })} />
                    </div>
                    <DialogFooter className="mt-6 flex flex-row gap-3 justify-end items-center bg-slate-50 -mx-6 -mb-4 px-6 py-4 border-t border-slate-100 rounded-b-xl">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Add Stop"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface AssignmentFormProps extends DialogProps<TransportAssignmentData> {
    students: any[];
    routes: TransportRouteData[];
}

export function AssignmentForm({ mode, initialData, isOpen, isSubmitting, onClose, onSubmit, students, routes }: AssignmentFormProps) {
    const { control, handleSubmit, register, reset, watch, formState: { errors } } = useForm<TransportAssignmentData>({
        defaultValues: initialData || { studentId: "", routeId: "", stopId: "", pickupPoint: "", startDate: new Date().toISOString().slice(0, 10), endDate: "", status: "Active" },
    });
    const routeId = watch("routeId");
    const route = routes.find((item) => item.id === routeId);

    React.useEffect(() => {
        if (isOpen) reset(initialData || { studentId: "", routeId: "", stopId: "", pickupPoint: "", startDate: new Date().toISOString().slice(0, 10), endDate: "", status: "Active" });
    }, [initialData, isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[620px] bg-white rounded-xl p-0 shadow-lg border-none">
                <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-100 rounded-t-xl">
                    <DialogTitle className="text-base font-bold text-slate-800">{mode === "create" ? "Assign Student" : "Edit Assignment"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
                    <Controller control={control} name="studentId" render={({ field }) => (
                        <SelectInput
                            label="Student"
                            required
                            searchable
                            showNoneOption={false}
                            disabled={mode === "edit"}
                            options={students.map((item) => ({ value: item.id, label: `${item.fullName || item.name || item.studentId} - ${item.studentId || item.admissionNo || ""}` }))}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.studentId?.message}
                        />
                    )} rules={{ required: "Student is required" }} />
                    <Controller control={control} name="routeId" render={({ field }) => (
                        <SelectInput
                            label="Route"
                            required
                            showNoneOption={false}
                            options={routes.map((item) => ({ value: item.id || "", label: item.name }))}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.routeId?.message}
                        />
                    )} rules={{ required: "Route is required" }} />
                    <Controller control={control} name="stopId" render={({ field }) => (
                        <SelectInput
                            label="Stop"
                            options={(route?.stops || []).map((item) => ({ value: item.id || "", label: `${item.name}${item.monthlyFee ? ` - ${item.monthlyFee}` : ""}` }))}
                            value={field.value || ""}
                            onChange={field.onChange}
                            disabled={!route}
                        />
                    )} />
                    <FormInput id="pickupPoint" label="Pickup Point" placeholder="Optional pickup note" {...register("pickupPoint")} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput id="startDate" label="Start Date" type="date" required error={errors.startDate?.message} {...register("startDate", { required: "Start date is required" })} />
                        <FormInput id="endDate" label="End Date" type="date" {...register("endDate")} />
                        <Controller control={control} name="status" render={({ field }) => <SelectInput label="Status" showNoneOption={false} options={statusOptions} value={field.value} onChange={field.onChange} />} />
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
