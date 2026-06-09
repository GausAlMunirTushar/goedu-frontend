"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Search, Bell, Eye, Calendar, Tag, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Notice {
    id: string;
    title: string;
    category: "Academic" | "Event" | "Admission" | "Circular" | "General";
    date: string;
    content: string;
    status: "Published" | "Draft";
    attachment?: string;
}

export function NoticesManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [notices, setNotices] = useState<Notice[]>([
        {
            id: "1",
            title: "Class Routine Published for Year 2026",
            category: "Academic",
            date: "2026-01-11",
            content: "The annual class routines for Grades 1 to 10 are now active and available for download. Classes start daily at 8:00 AM.",
            status: "Published",
            attachment: "class_routine_2026.pdf"
        },
        {
            id: "2",
            title: "Admission Open for Session 2026-2027",
            category: "Admission",
            date: "2025-12-15",
            content: "Applications are open for admission to all classes. Apply online or visit the admin desk during working hours.",
            status: "Published"
        },
        {
            id: "3",
            title: "Winter Vacation Notice",
            category: "Circular",
            date: "2025-12-20",
            content: "The institution will remain closed from December 24 to January 3 due to winter holidays. Online classes resume from Jan 4.",
            status: "Draft"
        }
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentNotice, setCurrentNotice] = useState<Partial<Notice>>({
        title: "",
        category: "Academic",
        date: new Date().toISOString().split('T')[0],
        content: "",
        status: "Published",
        attachment: ""
    });

    const handleSaveNotice = () => {
        if (!currentNotice.title || !currentNotice.content || !currentNotice.date) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (dialogMode === "add") {
            setNotices([
                {
                    id: Date.now().toString(),
                    title: currentNotice.title,
                    category: currentNotice.category || "Academic",
                    date: currentNotice.date,
                    content: currentNotice.content,
                    status: currentNotice.status || "Published",
                    attachment: currentNotice.attachment
                },
                ...notices
            ]);
            toast.success("Notice created successfully");
        } else {
            setNotices(notices.map(n => n.id === currentNotice.id ? (currentNotice as Notice) : n));
            toast.success("Notice updated successfully");
        }
        setIsDialogOpen(false);
    };

    const handleEditNotice = (notice: Notice) => {
        setCurrentNotice(notice);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleDeleteNotice = (id: string) => {
        setNotices(notices.filter(n => n.id !== id));
        toast.success("Notice deleted");
    };

    const toggleStatus = (id: string) => {
        setNotices(notices.map(n => {
            if (n.id === id) {
                const newStatus = n.status === "Published" ? "Draft" : "Published";
                toast.success(`Notice status updated to ${newStatus}`);
                return { ...n, status: newStatus };
            }
            return n;
        }));
    };

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Notice Board Management</Title>
                    <p className="text-sm text-gray-500 mt-1">Publish, edit or delete notices displayed on the website notice board</p>
                </div>
                <Button onClick={() => { setCurrentNotice({ title: "", category: "Academic", date: new Date().toISOString().split('T')[0], content: "", status: "Published", attachment: "" }); setDialogMode("add"); setIsDialogOpen(true); }} className="flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="w-4 h-4" /> Add Notice
                </Button>
            </div>

            {/* List and Search */}
            <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" /> Active Notices
                        </CardTitle>
                        <CardDescription>View all website announcements and bulletins</CardDescription>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search notices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/40 text-gray-500 border-b border-gray-100 text-xs uppercase font-semibold">
                                    <th className="px-6 py-4">Notice Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Publish Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredNotices.length > 0 ? (
                                    filteredNotices.map((notice) => (
                                        <tr key={notice.id} className="hover:bg-gray-50/30 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800 line-clamp-1">{notice.title}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{notice.content}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                                    <Tag className="w-3 h-3" /> {notice.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 flex items-center gap-1.5 py-6">
                                                <Calendar className="w-4 h-4 text-gray-400" /> {notice.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={notice.status === "Published"}
                                                        onCheckedChange={() => toggleStatus(notice.id)}
                                                    />
                                                    <Badge className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 ${notice.status === "Published" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}`}>
                                                        {notice.status}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-600" onClick={() => handleEditNotice(notice)}>
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleDeleteNotice(notice.id)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                            No notices found matching search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog Form */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg bg-white">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "add" ? "Create New Announcement" : "Update Notice"}</DialogTitle>
                        <DialogDescription>Fill in the form to post an update to the Notice board</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="title">Notice Title *</Label>
                            <Input
                                id="title"
                                placeholder="E.g., Mid-Term Examination Routine"
                                value={currentNotice.title}
                                onChange={(e) => setCurrentNotice({ ...currentNotice, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    value={currentNotice.category}
                                    onChange={(e) => setCurrentNotice({ ...currentNotice, category: e.target.value as any })}
                                >
                                    <option value="Academic">Academic</option>
                                    <option value="Event">Event</option>
                                    <option value="Admission">Admission</option>
                                    <option value="Circular">Circular</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="date">Publish Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={currentNotice.date}
                                    onChange={(e) => setCurrentNotice({ ...currentNotice, date: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="content">Notice Content *</Label>
                            <Textarea
                                id="content"
                                placeholder="Write notice details here..."
                                value={currentNotice.content}
                                onChange={(e) => setCurrentNotice({ ...currentNotice, content: e.target.value })}
                                rows={5}
                                className="resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="attachment">Attachment Filename (Optional)</Label>
                            <Input
                                id="attachment"
                                placeholder="E.g., syllabus_2026.pdf"
                                value={currentNotice.attachment}
                                onChange={(e) => setCurrentNotice({ ...currentNotice, attachment: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-700">Published Status</span>
                                <span className="text-xs text-gray-400">If disabled, this is stored as a draft</span>
                            </div>
                            <Switch
                                checked={currentNotice.status === "Published"}
                                onCheckedChange={(val) => setCurrentNotice({ ...currentNotice, status: val ? "Published" : "Draft" })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveNotice}>Save Notice</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
