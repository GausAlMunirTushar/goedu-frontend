"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Search, Image as ImageIcon, Sparkles, Filter, Grid } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface GalleryItem {
    id: string;
    title: string;
    category: "Academic" | "Sports" | "Events" | "Campus" | "Other";
    imageUrl: string;
    description?: string;
}

export function GalleryManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const [items, setItems] = useState<GalleryItem[]>([
        {
            id: "1",
            title: "Science Laboratory",
            category: "Academic",
            imageUrl: "https://images.unsplash.com/photo-1518152006812-cdff28b66480?q=80&w=2070",
            description: "Students performing physics experiment in the modern lab."
        },
        {
            id: "2",
            title: "Annual Sports Day 2025",
            category: "Sports",
            imageUrl: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?q=80&w=2070",
            description: "Athletics track event for senior group."
        },
        {
            id: "3",
            title: "Campus Main Building",
            category: "Campus",
            imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070",
            description: "An overview of our lush green main building campus."
        },
        {
            id: "4",
            title: "Graduation Ceremony",
            category: "Events",
            imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070",
            description: "Celebrating the class of 2025 accomplishments."
        }
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
        title: "",
        category: "Academic",
        imageUrl: "",
        description: ""
    });

    const handleSaveItem = () => {
        if (!currentItem.title || !currentItem.imageUrl) {
            toast.error("Please fill in the required fields");
            return;
        }

        if (dialogMode === "add") {
            setItems([
                ...items,
                {
                    id: Date.now().toString(),
                    title: currentItem.title,
                    category: currentItem.category || "Academic",
                    imageUrl: currentItem.imageUrl,
                    description: currentItem.description
                }
            ]);
            toast.success("Image added to gallery");
        } else {
            setItems(items.map(it => it.id === currentItem.id ? (currentItem as GalleryItem) : it));
            toast.success("Gallery item updated");
        }
        setIsDialogOpen(false);
    };

    const handleEditItem = (item: GalleryItem) => {
        setCurrentItem(item);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleDeleteItem = (id: string) => {
        setItems(items.filter(it => it.id !== id));
        toast.success("Gallery item deleted");
    };

    const filteredItems = items.filter(it => {
        const matchesSearch = it.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (it.description && it.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "All" || it.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ["All", "Academic", "Sports", "Events", "Campus", "Other"];

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Gallery CMS Management</Title>
                    <p className="text-sm text-gray-500 mt-1">Add, update or remove photos shown on the public Website Gallery page</p>
                </div>
                <Button onClick={() => { setCurrentItem({ title: "", category: "Academic", imageUrl: "", description: "" }); setDialogMode("add"); setIsDialogOpen(true); }} className="flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="w-4 h-4" /> Add Media
                </Button>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                                selectedCategory === cat
                                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search field */}
                <div className="relative w-full md:w-72 shrink-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search media by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white"
                    />
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <Card key={item.id} className="group relative border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full bg-white">
                            <div className="h-44 w-full relative bg-gray-100 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[10px] font-bold text-primary shadow-sm">
                                    {item.category}
                                </div>
                            </div>
                            <CardContent className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm leading-snug line-clamp-1">{item.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.description || "No description provided."}</p>
                                </div>
                                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
                                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-600" onClick={() => handleEditItem(item)}>
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleDeleteItem(item.id)}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center text-gray-400">
                        <Grid className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No pictures found in this gallery category.</p>
                    </div>
                )}
            </div>

            {/* Dialog Form */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "add" ? "Add Photo to Gallery" : "Edit Photo Details"}</DialogTitle>
                        <DialogDescription>Add a high quality unsplash image URL to build your public gallery</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="item-title">Photo Title *</Label>
                            <Input
                                id="item-title"
                                placeholder="E.g., Science Fair Winners"
                                value={currentItem.title}
                                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="item-cat">Category</Label>
                            <select
                                id="item-cat"
                                className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={currentItem.category}
                                onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value as any })}
                            >
                                <option value="Academic">Academic</option>
                                <option value="Sports">Sports</option>
                                <option value="Events">Events</option>
                                <option value="Campus">Campus</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="item-url">Image URL *</Label>
                            <Input
                                id="item-url"
                                placeholder="E.g., https://images.unsplash.com/..."
                                value={currentItem.imageUrl}
                                onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="item-desc">Short Description</Label>
                            <Input
                                id="item-desc"
                                placeholder="Describe the image event (optional)..."
                                value={currentItem.description}
                                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveItem}>Save Image</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
