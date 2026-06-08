import { columns, Payment } from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    // For demo purposes, we'll return static data
    return [
        {
            id: "m5gr84i9",
            amount: 316,
            status: "success",
            email: "ken99@example.com",
        },
        {
            id: "3u1reuv4",
            amount: 242,
            status: "success",
            email: "Abe45@example.com",
        },
        {
            id: "derv1ws0",
            amount: 837,
            status: "processing",
            email: "Monserrat44@example.com",
        },
        {
            id: "5kma53ae",
            amount: 874,
            status: "success",
            email: "Silas22@example.com",
        },
        {
            id: "bhqecj4p",
            amount: 721,
            status: "failed",
            email: "carmella@example.com",
        },
        {
            id: "a1b2c3d4",
            amount: 450,
            status: "pending",
            email: "john.doe@example.com",
        },
        {
            id: "e5f6g7h8",
            amount: 920,
            status: "success",
            email: "jane.smith@example.com",
        },
        {
            id: "i9j0k1l2",
            amount: 156,
            status: "processing",
            email: "bob.wilson@example.com",
        },
        {
            id: "m3n4o5p6",
            amount: 689,
            status: "failed",
            email: "alice.brown@example.com",
        },
        {
            id: "q7r8s9t0",
            amount: 345,
            status: "success",
            email: "charlie.davis@example.com",
        },
    ];
}

export default async function PaymentsPage() {
    const data = await getData();

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Payments</h1>
            <DataTable
                columns={columns}
                data={data}
                searchKey="email"
                searchPlaceholder="Filter emails..."
            />
        </div>
    );
}
