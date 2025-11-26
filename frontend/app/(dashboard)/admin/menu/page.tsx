"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    is_available: boolean;
}

export default function AdminMenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({});
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (currentItem.id) {
                await api.put(`/menu/${currentItem.id}`, currentItem);
            } else {
                await api.post("/menu/", currentItem);
            }
            setIsDialogOpen(false);
            fetchMenu();
        } catch (error) {
            console.error("Failed to save item", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await api.delete(`/menu/${id}`);
            fetchMenu();
        } catch (error) {
            console.error("Failed to delete item", error);
        }
    };

    const openEdit = (item: MenuItem) => {
        setCurrentItem(item);
        setIsDialogOpen(true);
    };

    const openCreate = () => {
        setCurrentItem({ is_available: true });
        setIsDialogOpen(true);
    };

    if (isLoading) return <div>Loading menu...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Manage Menu</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{currentItem.id ? "Edit Item" : "Create Item"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={currentItem.name || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Input
                                    id="description"
                                    value={currentItem.description || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={currentItem.price || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Input
                                    id="category"
                                    value={currentItem.category || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                    <Card key={item.id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between">
                                <span>{item.name}</span>
                                <span>${item.price}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium bg-secondary px-2 py-1 rounded">{item.category}</span>
                                <span className={`text-sm ${item.is_available ? "text-green-600" : "text-red-600"}`}>
                                    {item.is_available ? "Available" : "Unavailable"}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end space-x-2">
                            <Button variant="outline" size="icon" onClick={() => openEdit(item)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
