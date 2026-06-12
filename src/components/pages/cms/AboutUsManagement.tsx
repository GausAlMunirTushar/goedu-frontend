"use client";

import React, { useState, useEffect } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Save, FileText, Target, Eye, Compass } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useWebsiteContentQuery } from "@/apis/queries/website_queries";
import { updateWebsiteContent } from "@/apis/mutations/website_mutations";

interface Section {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export function AboutUsManagement() {
    // Fetch data
    const { data: response, isLoading } = useWebsiteContentQuery("About");
    const contents = response?.data || [];

    const [aboutInfo, setAboutInfo] = useState({
        headline: "",
        subheadline: "",
        introduction: ""
    });

    const [sections, setSections] = useState<Section[]>([]);

    useEffect(() => {
        if (!isLoading && contents.length > 0) {
            const getSection = (sec: string) => contents.find((c: any) => c.section === sec);
            
            const aboutData = getSection("PrimaryIntro")?.content;
            if (aboutData) setAboutInfo(JSON.parse(aboutData));

            const sectionsData = getSection("KeySections")?.content;
            if (sectionsData) setSections(JSON.parse(sectionsData));
        }
    }, [isLoading, contents]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [currentSection, setCurrentSection] = useState<Partial<Section>>({ title: "", description: "", icon: "Target" });

    const handleSaveSection = () => {
        if (!currentSection.title || !currentSection.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (dialogMode === "add") {
            setSections([
                ...sections,
                {
                    id: Date.now().toString(),
                    title: currentSection.title,
                    description: currentSection.description,
                    icon: currentSection.icon || "Target"
                }
            ]);
            toast.success("Section added successfully");
        } else {
            setSections(sections.map(s => s.id === currentSection.id ? (currentSection as Section) : s));
            toast.success("Section updated successfully");
        }
        setIsDialogOpen(false);
    };

    const handleEditSection = (section: Section) => {
        setCurrentSection(section);
        setDialogMode("edit");
        setIsDialogOpen(true);
    };

    const handleDeleteSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
        toast.success("Section removed");
    };

    const handleSaveAll = async () => {
        try {
            const payload = {
                sections: [
                    { section: "PrimaryIntro", content: JSON.stringify(aboutInfo) },
                    { section: "KeySections", content: JSON.stringify(sections) }
                ]
            };

            await updateWebsiteContent("About", payload);
            toast.success("About Us content saved successfully!");
        } catch (error) {
            toast.error("Failed to save About Us content");
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Loading About Us Settings...</div>;

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>About Us Management</Title>
                    <p className="text-sm text-gray-500 mt-1">Configure and manage content for the public About Us page</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-colors">
                        <FileText className="w-4 h-4" /> View Page
                    </Button>
                    <Button onClick={handleSaveAll} className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95">
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
            </div>

            {/* Main About Form */}
            <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                    <CardTitle className="text-lg font-bold text-gray-800">Primary Introduction</CardTitle>
                    <CardDescription>Headline, sub-headline and introduction text for the About page</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="headline">Main Headline</Label>
                            <Input
                                id="headline"
                                value={aboutInfo.headline}
                                onChange={(e) => setAboutInfo({ ...aboutInfo, headline: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="subheadline">Sub Headline / Tagline</Label>
                            <Input
                                id="subheadline"
                                value={aboutInfo.subheadline}
                                onChange={(e) => setAboutInfo({ ...aboutInfo, subheadline: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="introduction">Introduction Text</Label>
                        <Textarea
                            id="introduction"
                            value={aboutInfo.introduction}
                            onChange={(e) => setAboutInfo({ ...aboutInfo, introduction: e.target.value })}
                            rows={6}
                            className="resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Vision, Mission, Values Sections */}
            <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row justify-between items-center py-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" /> Key Organization Sections
                        </CardTitle>
                        <CardDescription>Manage strategic elements like Vision, Mission, Values, History, etc.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {sections.length === 0 && (
                            <Button variant="outline" size="sm" onClick={() => setSections([
                                { id: "1", title: "Our Vision", description: "To be a leading center of educational excellence.", icon: "Eye" },
                                { id: "2", title: "Our Mission", description: "To offer a comprehensive and challenging curriculum.", icon: "Target" }
                            ])}>Initialize Default</Button>
                        )}
                        <Button onClick={() => { setCurrentSection({ title: "", description: "", icon: "Target" }); setDialogMode("add"); setIsDialogOpen(true); }} size="sm" className="flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Section
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {sections.map(section => (
                            <div key={section.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/20 hover:bg-gray-50/50 transition-colors duration-200">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                                        {section.icon === "Eye" && <Eye className="w-5 h-5" />}
                                        {section.icon === "Target" && <Target className="w-5 h-5" />}
                                        {section.icon === "Compass" && <Compass className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">{section.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0 self-end md:self-auto">
                                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-600" onClick={() => handleEditSection(section)}>
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleDeleteSection(section.id)}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "add" ? "Add Key Section" : "Edit Key Section"}</DialogTitle>
                        <DialogDescription>Add section titles like 'Our Philosophy' or 'Aims'</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="sec-title">Section Title *</Label>
                            <Input
                                id="sec-title"
                                placeholder="E.g., Our Vision"
                                value={currentSection.title}
                                onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="sec-icon">Icon Representation</Label>
                            <select
                                id="sec-icon"
                                className="w-full bg-white border border-gray-200 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                value={currentSection.icon}
                                onChange={(e) => setCurrentSection({ ...currentSection, icon: e.target.value })}
                            >
                                <option value="Target">Target (Mission)</option>
                                <option value="Eye">Eye (Vision)</option>
                                <option value="Compass">Compass (Values)</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="sec-desc">Description Content *</Label>
                            <Textarea
                                id="sec-desc"
                                placeholder="E.g., What the school strives to achieve..."
                                value={currentSection.description}
                                onChange={(e) => setCurrentSection({ ...currentSection, description: e.target.value })}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveSection}>Save Section</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
