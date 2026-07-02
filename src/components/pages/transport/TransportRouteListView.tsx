"use client";

import { AxiosAPI } from "@/apis/configs";
import {
    transportRouteDetailUrl,
    transportRouteStopsUrl,
    transportRoutesUrl,
    transportStopDetailUrl,
} from "@/apis/endpoints/transport_apis";
import {
    useTransportDriversQuery,
    useTransportRoutesQuery,
    useTransportVehiclesQuery,
} from "@/apis/queries/transport_queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/custom-ui/table-skeleton";
import Title from "@/components/ui/custom-ui/title";
import { DataTable } from "@/components/ui/data-table/data-table";
import TableActions from "@/components/ui/table-actions";
import { useModalStore } from "@/stores/modalStore";
import { ColumnDef } from "@tanstack/react-table";
import { MapPin, Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { RouteForm, StopForm } from "./TransportForms";
import type { TransportRouteData, TransportStopData } from "./transportTypes";

export function TransportRouteListView() {
    const openModal = useModalStore((state) => state.openModal);
    const [search, setSearch] = React.useState("");
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isStopOpen, setIsStopOpen] = React.useState(false);
    const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
    const [editingData, setEditingData] = React.useState<TransportRouteData>();
    const [selectedRoute, setSelectedRoute] = React.useState<TransportRouteData>();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: response, isLoading, mutate } = useTransportRoutesQuery();
    const { data: vehicleResponse } = useTransportVehiclesQuery();
    const { data: driverResponse } = useTransportDriversQuery();

    const rows = React.useMemo(() => response?.data || [], [response]);
    const vehicles = React.useMemo(() => vehicleResponse?.data || [], [vehicleResponse]);
    const drivers = React.useMemo(() => driverResponse?.data || [], [driverResponse]);
    const filteredRows = React.useMemo(() => rows.filter((item: TransportRouteData) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.code?.toLowerCase().includes(search.toLowerCase()) ||
        item.driver?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.vehicle?.registrationNo?.toLowerCase().includes(search.toLowerCase()),
    ), [rows, search]);

    const handleSubmit = async (formData: TransportRouteData) => {
        setIsSaving(true);
        try {
            const payload = {
                name: formData.name,
                code: formData.code || undefined,
                vehicleId: formData.vehicleId || undefined,
                driverId: formData.driverId || undefined,
                status: formData.status,
            };
            const res = formMode === "create"
                ? await AxiosAPI.post(transportRoutesUrl, payload)
                : await AxiosAPI.put(transportRouteDetailUrl(formData.id!), payload);
            if (res.data?.success) {
                toast.success(formMode === "create" ? "Route created" : "Route updated");
                mutate();
                setIsFormOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStopSubmit = async (formData: TransportStopData) => {
        if (!selectedRoute?.id) return;
        setIsSaving(true);
        try {
            await AxiosAPI.post(transportRouteStopsUrl(selectedRoute.id), {
                name: formData.name,
                pickupTime: formData.pickupTime || undefined,
                dropTime: formData.dropTime || undefined,
                monthlyFee: formData.monthlyFee ? Number(formData.monthlyFee) : undefined,
                sortOrder: Number(formData.sortOrder || 0),
            });
            toast.success("Stop added");
            mutate();
            setIsStopOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Stop add failed");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        openModal("confirm-delete", {
            title: "Delete route",
            description: "This route will be removed from active transport setup.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(transportRouteDetailUrl(id));
                    toast.success("Route deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const handleStopDelete = (id: string) => {
        openModal("confirm-delete", {
            title: "Delete stop",
            description: "This stop will be removed from the route.",
            onConfirm: async () => {
                try {
                    await AxiosAPI.delete(transportStopDetailUrl(id));
                    toast.success("Stop deleted");
                    mutate();
                } catch (error: any) {
                    toast.error(error.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const columns: ColumnDef<TransportRouteData>[] = [
        { accessorKey: "name", header: "Route" },
        { accessorKey: "code", header: "Code" },
        { header: "Vehicle", cell: ({ row }) => row.original.vehicle ? `${row.original.vehicle.name} (${row.original.vehicle.registrationNo})` : "-" },
        { header: "Driver", cell: ({ row }) => row.original.driver ? `${row.original.driver.name} (${row.original.driver.phone})` : "-" },
        { header: "Stops", cell: ({ row }) => row.original.stops?.length || 0 },
        { header: "Students", cell: ({ row }) => row.original._count?.assignments || 0 },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{row.original.status}</span>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <TableActions
                    onEdit={() => {
                        setFormMode("edit");
                        setEditingData(row.original);
                        setIsFormOpen(true);
                    }}
                    onDelete={() => handleDelete(row.original.id!)}
                    extraActions={[{
                        label: "Add Stop",
                        icon: <MapPin size={16} />,
                        onClick: () => {
                            setSelectedRoute(row.original);
                            setIsStopOpen(true);
                        },
                    }]}
                />
            ),
        },
    ];

    if (isLoading) return <TableSkeleton />;

    return (
        <div className="p-2 space-y-4">
            <Card>
                <CardHeader className="bg-white border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <Title>Routes</Title>
                            <p className="text-xs text-muted-foreground mt-1">Build route plans with assigned vehicles, drivers, and stops.</p>
                        </div>
                        <Button onClick={() => { setFormMode("create"); setEditingData(undefined); setIsFormOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" /> Add Route
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="bg-white rounded-b-xl space-y-4">
                    <DataTable columns={columns} data={filteredRows} searchKey="name" searchPlaceholder="Search routes..." searchValue={search} onSearch={setSearch} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {filteredRows.map((route: TransportRouteData) => (
                            <div key={route.id} className="border rounded-md p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold">{route.name}</p>
                                        <p className="text-xs text-muted-foreground">{route.stops?.length || 0} stops</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => { setSelectedRoute(route); setIsStopOpen(true); }}>Add Stop</Button>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {(route.stops || []).map((stop) => (
                                        <div key={stop.id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-xs">
                                            <span className="font-medium">{stop.name}</span>
                                            <span className="text-muted-foreground">{stop.pickupTime || "-"} / {stop.dropTime || "-"}</span>
                                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleStopDelete(stop.id!)}>Delete</Button>
                                        </div>
                                    ))}
                                    {!route.stops?.length && <p className="text-xs text-muted-foreground">No stops added.</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <RouteForm mode={formMode} initialData={editingData} isOpen={isFormOpen} isSubmitting={isSaving} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} vehicles={vehicles} drivers={drivers} />
            <StopForm route={selectedRoute} isOpen={isStopOpen} isSubmitting={isSaving} onClose={() => setIsStopOpen(false)} onSubmit={handleStopSubmit} />
        </div>
    );
}
