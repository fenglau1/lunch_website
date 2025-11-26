"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    is_available: boolean;
}

interface CartItem extends MenuItem {
    quantity: number;
}

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOrdering, setIsOrdering] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await api.get("/menu/");
            setMenuItems(response.data);
        } catch (error) {
            console.error("Failed to fetch menu", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: number) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === itemId);
            if (existing && existing.quantity > 1) {
                return prev.map((i) =>
                    i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                );
            }
            return prev.filter((i) => i.id !== itemId);
        });
    };

    const placeOrder = async () => {
        setIsOrdering(true);
        try {
            const orderData = {
                items: cart.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                })),
            };
            await api.post("/orders/", orderData);
            setCart([]);
            alert("Order placed successfully!");
        } catch (error) {
            console.error("Failed to place order", error);
            alert("Failed to place order");
        } finally {
            setIsOrdering(false);
        }
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (isLoading) return <div>Loading menu...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Daily Menu</h2>
                {cart.length > 0 && (
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold">Total: ${totalAmount.toFixed(2)}</span>
                        <Button onClick={placeOrder} disabled={isOrdering}>
                            {isOrdering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Place Order ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>{item.name}</span>
                                <span>${item.price}</span>
                            </CardTitle>
                            <CardDescription>{item.category}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </CardContent>
                        <CardFooter>
                            {cart.find((i) => i.id === item.id) ? (
                                <div className="flex items-center space-x-2 w-full justify-end">
                                    <Button variant="outline" size="icon" onClick={() => removeFromCart(item.id)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center">
                                        {cart.find((i) => i.id === item.id)?.quantity}
                                    </span>
                                    <Button variant="outline" size="icon" onClick={() => addToCart(item)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button className="w-full" onClick={() => addToCart(item)} disabled={!item.is_available}>
                                    {item.is_available ? "Add to Cart" : "Sold Out"}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
