"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface OrderItem {
    id: number;
    menu_item_id: number;
    quantity: number;
    price_at_time: number;
}

interface Order {
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/");
            setOrders(response.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500";
            case "paid": return "bg-blue-500";
            case "completed": return "bg-green-500";
            case "cancelled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    if (isLoading) return <div>Loading orders...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Orders</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Order #{order.id}</CardTitle>
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            </div>
                            <CardDescription>
                                {format(new Date(order.created_at), "PPP p")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center font-bold">
                                <span>Total Amount</span>
                                <span>${order.total_amount}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {orders.length === 0 && (
                    <p className="text-muted-foreground">No orders found.</p>
                )}
            </div>
        </div>
    );
}
