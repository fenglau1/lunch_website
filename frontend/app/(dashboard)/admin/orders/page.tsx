"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface Order {
    id: number;
    user_id: number;
    status: string;
    total_amount: number;
    created_at: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

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

    const updateStatus = async (orderId: number, status: string) => {
        setUpdatingId(orderId);
        try {
            await api.put(`/orders/${orderId}/status?status=${status}`);
            fetchOrders();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdatingId(null);
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
            <h2 className="text-3xl font-bold tracking-tight">Manage Orders</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Order #{order.id}</CardTitle>
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            </div>
                            <CardDescription>
                                User ID: {order.user_id} | {format(new Date(order.created_at), "PPP p")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center font-bold mb-4">
                                <span>Total Amount</span>
                                <span>${order.total_amount}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">Update Status:</span>
                                <Select
                                    disabled={updatingId === order.id}
                                    onValueChange={(value) => updateStatus(order.id, value)}
                                    defaultValue={order.status}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                {updatingId === order.id && <Loader2 className="h-4 w-4 animate-spin" />}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
