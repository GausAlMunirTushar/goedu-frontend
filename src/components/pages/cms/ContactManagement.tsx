"use client";

import React, { useState } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Phone, Mail, MapPin, Eye, Trash2, MailOpen, Inbox, FileText, Send } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    status: "Read" | "Unread";
}

export function ContactManagement() {
    // Contact Info Config
    const [contactInfo, setContactInfo] = useState({
        email: "info@epathshala.edu.bd",
        phone: "+880 2-1234567",
        mobile: "+880 1712-345678",
        address: "House 42, Road 11, Banani, Dhaka, Bangladesh",
        mapLink: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.157474474776!2d90.40228791536294!3d23.79520038456743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70e08abcb37%3A0xe543c7b396739943!2sBanani%20Graveyard!5e0!3m2!1sen!2sbd!4v1623126789012!5m2!1sen!2sbd",
        facebook: "https://facebook.com/epathshala",
        youtube: "https://youtube.com/epathshala"
    });

    // Received Messages Inbox
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            name: "Zahid Hasan",
            email: "zahid@gmail.com",
            subject: "Admission Query for Grade 6",
            message: "Hello, I wanted to know the fee structure and admission test date for Grade 6 for the upcoming session. Thank you.",
            date: "2026-06-08 14:30",
            status: "Unread"
        },
        {
            id: "2",
            name: "Tahmina Rahman",
            email: "tahmina.r@yahoo.com",
            subject: "Syllabus details",
            message: "Could you please upload the latest syllabus for Class 8 term exams? I couldn't find it on the notices page.",
            date: "2026-06-07 10:15",
            status: "Read"
        }
    ]);

    const [activeTab, setActiveTab] = useState<"info" | "inbox">("info");
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleSaveInfo = () => {
        toast.success("Contact Information configuration saved and published!");
    };

    const handleViewMessage = (msg: Message) => {
        setSelectedMessage(msg);
        setIsMessageOpen(true);
        // Mark as read
        if (msg.status === "Unread") {
            setMessages(messages.map(m => m.id === msg.id ? { ...m, status: "Read" } : m));
        }
    };

    const handleDeleteMessage = (id: string) => {
        setMessages(messages.filter(m => m.id !== id));
        toast.success("Message deleted");
    };

    const handleSendReply = () => {
        if (!replyText.trim()) {
            toast.error("Please type a reply message");
            return;
        }
        toast.success(`Reply sent successfully to ${selectedMessage?.email}`);
        setIsMessageOpen(false);
        setReplyText("");
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Contact CMS & Messages</Title>
                    <p className="text-sm text-gray-500 mt-1">Configure contact details and manage messages received from the website contact form</p>
                </div>
                {activeTab === "info" && (
                    <Button onClick={handleSaveInfo} className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                        <Save className="w-4 h-4" /> Save Configuration
                    </Button>
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("info")}
                    className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === "info"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Phone className="w-4 h-4" /> Contact Settings
                </button>
                <button
                    onClick={() => setActiveTab("inbox")}
                    className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === "inbox"
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Inbox className="w-4 h-4" /> Visitor Inbox
                    {messages.filter(m => m.status === "Unread").length > 0 && (
                        <span className="bg-red-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center font-bold">
                            {messages.filter(m => m.status === "Unread").length}
                        </span>
                    )}
                </button>
            </div>

            {/* Tab: Contact Settings */}
            {activeTab === "info" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Details */}
                    <Card className="lg:col-span-2 shadow-sm border-gray-200/60">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                            <CardTitle className="text-lg font-bold text-gray-800">Public Contact Details</CardTitle>
                            <CardDescription>Configure basic contact methods displayed on the footer & contact page</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> Institution Email</Label>
                                    <Input
                                        id="email"
                                        value={contactInfo.email}
                                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> Telephone</Label>
                                    <Input
                                        id="phone"
                                        value={contactInfo.phone}
                                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="mobile" className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> Mobile Number</Label>
                                    <Input
                                        id="mobile"
                                        value={contactInfo.mobile}
                                        onChange={(e) => setContactInfo({ ...contactInfo, mobile: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="address" className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> Physical Address</Label>
                                    <Input
                                        id="address"
                                        value={contactInfo.address}
                                        onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mapLink">Google Maps Embed Link (Iframe Src)</Label>
                                <Input
                                    id="mapLink"
                                    value={contactInfo.mapLink}
                                    onChange={(e) => setContactInfo({ ...contactInfo, mapLink: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="facebook">Facebook Link</Label>
                                    <Input
                                        id="facebook"
                                        value={contactInfo.facebook}
                                        onChange={(e) => setContactInfo({ ...contactInfo, facebook: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="youtube">YouTube Link</Label>
                                    <Input
                                        id="youtube"
                                        value={contactInfo.youtube}
                                        onChange={(e) => setContactInfo({ ...contactInfo, youtube: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview Map Card */}
                    <Card className="shadow-sm border-gray-200/60 overflow-hidden flex flex-col">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                            <CardTitle className="text-lg font-bold text-gray-800">Map Preview</CardTitle>
                            <CardDescription>Live representation of public contact map</CardDescription>
                        </CardHeader>
                        <div className="flex-1 w-full bg-gray-100 h-64 lg:h-auto min-h-[250px]">
                            <iframe
                                src={contactInfo.mapLink}
                                className="w-full h-full border-0"
                                allowFullScreen={false}
                                loading="lazy"
                                title="Institution Map Location"
                            ></iframe>
                        </div>
                    </Card>
                </div>
            )}

            {/* Tab: Received Messages */}
            {activeTab === "inbox" && (
                <Card className="shadow-sm border-gray-200/60">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                        <CardTitle className="text-lg font-bold text-gray-800">Received Inquiries</CardTitle>
                        <CardDescription>Review messages sent by visitors through the public contact form</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/40 text-gray-500 border-b border-gray-100 text-xs uppercase font-semibold">
                                        <th className="px-6 py-4">Sender</th>
                                        <th className="px-6 py-4">Subject</th>
                                        <th className="px-6 py-4">Received On</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {messages.length > 0 ? (
                                        messages.map((msg) => (
                                            <tr key={msg.id} className={`hover:bg-gray-50/30 transition-colors duration-150 ${msg.status === "Unread" ? "bg-primary/5 hover:bg-primary/10" : ""}`}>
                                                <td className="px-6 py-4">
                                                    <div className={`font-semibold ${msg.status === "Unread" ? "text-gray-900 font-bold" : "text-gray-800"}`}>{msg.name}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{msg.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`line-clamp-1 ${msg.status === "Unread" ? "text-gray-900 font-bold" : "text-gray-700"}`}>{msg.subject}</div>
                                                    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{msg.message}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {msg.date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 ${msg.status === "Unread" ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}`}>
                                                        {msg.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-600" onClick={() => handleViewMessage(msg)}>
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleDeleteMessage(msg.id)}>
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                                No inquiries received.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* View & Reply Dialog */}
            <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                <DialogContent className="max-w-lg bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MailOpen className="w-5 h-5 text-primary" /> Read Inquiry
                        </DialogTitle>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="space-y-4 py-2 text-sm">
                            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                                <div>
                                    <span className="text-xs text-gray-400 font-medium uppercase">From</span>
                                    <div className="font-bold text-gray-800">{selectedMessage.name}</div>
                                    <div className="text-xs text-gray-500">{selectedMessage.email}</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-400 font-medium uppercase">Date</span>
                                    <div className="text-gray-700">{selectedMessage.date}</div>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 font-medium uppercase">Subject</span>
                                <div className="font-semibold text-gray-900 text-base">{selectedMessage.subject}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
                                {selectedMessage.message}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <Label htmlFor="reply" className="font-bold text-gray-800">Reply to Sender</Label>
                                <Textarea
                                    id="reply"
                                    placeholder="Type your email response here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMessageOpen(false)}>Close</Button>
                        <Button onClick={handleSendReply} className="flex items-center gap-1">
                            <Send className="w-4 h-4" /> Send Reply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
