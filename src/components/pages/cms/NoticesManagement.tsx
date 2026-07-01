"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Search, Bell, AlertCircle, MessageSquare } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useWebsiteNoticesQuery } from "@/apis/queries/website_queries";
import {
    createWebsiteNotice,
    updateWebsiteNotice,
    deleteWebsiteNotice,
} from "@/apis/mutations/website_mutations";
import { mutate } from "swr";
import { websiteNoticesUrl } from "@/apis/endpoints/cms/website_apis";
import type { TWebsiteNotice } from "@/apis/types/website_type";
import { SmsPreviewDialog } from "@/components/pages/settings/sms/SmsPreviewDialog";
import type { SmsSendPayload } from "@/apis/types/sms_type";

export function NoticesManagement() {
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch notices
    const { data: response, isLoading } = useWebsiteNoticesQuery();
    const notices: TWebsiteNotice[] = response?.data || [];

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentNotice, setCurrentNotice] = useState<Partial<TWebsiteNotice>>({
        title: "",
        content: "",
        isActive: true,
        attachmentUrl: "",
    });
    const [smsPayload, setSmsPayload] = useState<SmsSendPayload | null>(null);
    const [isSmsPreviewOpen, setIsSmsPreviewOpen] = useState(false);

    const handleSaveNotice = async () => {
        if (!currentNotice.title || !currentNotice.content) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (dialogMode === "add") {
                await createWebsiteNotice(currentNotice);
                toast.success("Notice created successfully");
            } else {
                await updateWebsiteNotice(currentNotice.id as string, currentNotice);
                toast.success("Notice updated successfully");
            }
            mutate(websiteNoticesUrl);
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to save notice");
        }
    };

    const handleEditNotice = (notice: TWebsiteNotice) => {
        setCurrentNotice(notice);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleDeleteNotice = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notice?")) return;
        try {
            await deleteWebsiteNotice(id);
            mutate(websiteNoticesUrl);
            toast.success("Notice deleted");
        } catch (error) {
            toast.error("Failed to delete notice");
        }
    };

    const toggleStatus = async (notice: TWebsiteNotice) => {
        try {
            await updateWebsiteNotice(notice.id, { ...notice, isActive: !notice.isActive });
            mutate(websiteNoticesUrl);
            toast.success(`Notice status updated`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleOpenSmsPreview = (notice: TWebsiteNotice) => {
        setSmsPayload({
            sourceType: "notice",
            sourceId: notice.id,
            message: "{{noticeTitle}}: {{noticeContent}} - {{institutionName}}",
            filters: {
                group: "all_students",
            },
        });
        setIsSmsPreviewOpen(true);
    };

    const filteredNotices = notices.filter((n) =>
        n.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Notice Board Management</Title>
                    <p className="text-sm text-gray-500 mt-1">
                        Publish, edit or delete notices displayed on the website notice board
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setCurrentNotice({
                            title: "",
                            content: "",
                            isActive: true,
                            attachmentUrl: "",
                        });
                        setDialogMode("add");
                        setIsDialogOpen(true);
                    }}
                    className="flex items-center gap-1 shadow-md hover:shadow-lg transition-all duration-300"
                >
                    <Plus className="w-4 h-4" /> Add Notice
                </Button>
            </div>

            <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" /> Active Notices
                        </CardTitle>
                        <CardDescription>
                            View all website announcements and bulletins
                        </CardDescription>
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
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-6">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredNotices.length > 0 ? (
                                    filteredNotices.map((notice) => (
                                        <tr
                                            key={notice.id}
                                            className="hover:bg-gray-50/30 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800 line-clamp-1">
                                                    {notice.title}
                                                </div>
                                                <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                    {notice.content}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={notice.isActive}
                                                        onCheckedChange={() => toggleStatus(notice)}
                                                    />
                                                    <Badge
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 ${notice.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}`}
                                                    >
                                                        {notice.isActive ? "Published" : "Draft"}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-gray-100 text-gray-600"
                                                        onClick={() => handleOpenSmsPreview(notice)}
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-gray-100 text-gray-600"
                                                        onClick={() => handleEditNotice(notice)}
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-red-50"
                                                        onClick={() =>
                                                            handleDeleteNotice(notice.id)
                                                        }
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-6 py-10 text-center text-gray-400"
                                        >
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg bg-white">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogMode === "add" ? "Create New Announcement" : "Update Notice"}
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the form to post an update to the Notice board
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="title">Notice Title *</Label>
                            <Input
                                id="title"
                                placeholder="E.g., Mid-Term Examination Routine"
                                value={currentNotice.title}
                                onChange={(e) =>
                                    setCurrentNotice({ ...currentNotice, title: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="content">Notice Content *</Label>
                            <Textarea
                                id="content"
                                placeholder="Write notice details here..."
                                value={currentNotice.content}
                                onChange={(e) =>
                                    setCurrentNotice({ ...currentNotice, content: e.target.value })
                                }
                                rows={5}
                                className="resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="attachment">Attachment Filename (Optional)</Label>
                            <Input
                                id="attachment"
                                placeholder="E.g., syllabus_2026.pdf"
                                value={currentNotice.attachmentUrl}
                                onChange={(e) =>
                                    setCurrentNotice({
                                        ...currentNotice,
                                        attachmentUrl: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-700">
                                    Published Status
                                </span>
                                <span className="text-xs text-gray-400">
                                    If disabled, this is stored as a draft
                                </span>
                            </div>
                            <Switch
                                checked={currentNotice.isActive}
                                onCheckedChange={(val) =>
                                    setCurrentNotice({ ...currentNotice, isActive: val })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveNotice}>Save Notice</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {smsPayload && (
                <SmsPreviewDialog
                    open={isSmsPreviewOpen}
                    payload={smsPayload}
                    onOpenChange={setIsSmsPreviewOpen}
                />
            )}
        </div>
    );
}
