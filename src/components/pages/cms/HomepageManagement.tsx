"use client";

import React, { useState, useEffect } from "react";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Edit2, Save, Globe, Eye, Image as ImageIcon, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useWebsiteContentQuery } from "@/apis/queries/website_queries";
import { updateWebsiteContent } from "@/apis/mutations/website_mutations";

interface Slide {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    active: boolean;
}

interface Stat {
    id: string;
    label: string;
    value: string;
    icon: string;
}

export function HomepageManagement() {
    // Fetch data
    const { data: response, isLoading } = useWebsiteContentQuery("Homepage");
    const contents = response?.data || [];

    // State
    const [slides, setSlides] = useState<Slide[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [principal, setPrincipal] = useState({ name: "", designation: "", message: "", avatar: "" });
    const [about, setAbout] = useState({ title: "", description: "" });

    // Populate data on load
    useEffect(() => {
        if (!isLoading && contents.length > 0) {
            const getSection = (sec: string) => contents.find((c: any) => c.section === sec);
            
            const heroData = getSection("HeroSlides")?.content;
            if (heroData) setSlides(JSON.parse(heroData));

            const statsData = getSection("QuickStats")?.content;
            if (statsData) setStats(JSON.parse(statsData));

            const principalData = getSection("PrincipalMessage")?.content;
            if (principalData) setPrincipal(JSON.parse(principalData));

            const aboutData = getSection("AboutSnippet")?.content;
            if (aboutData) setAbout(JSON.parse(aboutData));
        }
    }, [isLoading, contents]);

    const [isSlideDialogOpen, setIsSlideDialogOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState<Partial<Slide>>({ title: "", subtitle: "", image: "", active: true });
    const [slideDialogMode, setSlideDialogMode] = useState<"add" | "edit">("add");

    const handleSaveSlide = () => {
        if (!currentSlide.image || !currentSlide.title) {
            toast.error("Please fill in the required fields");
            return;
        }

        if (slideDialogMode === "add") {
            setSlides([
                ...slides,
                {
                    id: Date.now().toString(),
                    image: currentSlide.image,
                    title: currentSlide.title,
                    subtitle: currentSlide.subtitle || "",
                    active: currentSlide.active ?? true
                }
            ]);
            toast.success("Slide added. Don't forget to save changes!");
        } else {
            setSlides(slides.map(s => s.id === currentSlide.id ? (currentSlide as Slide) : s));
            toast.success("Slide updated. Don't forget to save changes!");
        }
        setIsSlideDialogOpen(false);
    };

    const handleEditSlide = (slide: Slide) => {
        setCurrentSlide(slide);
        setSlideDialogMode("edit");
        setIsSlideDialogOpen(true);
    };

    const handleDeleteSlide = (id: string) => {
        setSlides(slides.filter(s => s.id !== id));
        toast.success("Slide removed. Don't forget to save changes!");
    };

    const handleSaveAll = async () => {
        try {
            const payload = {
                sections: [
                    { section: "HeroSlides", content: JSON.stringify(slides) },
                    { section: "QuickStats", content: JSON.stringify(stats) },
                    { section: "PrincipalMessage", content: JSON.stringify(principal) },
                    { section: "AboutSnippet", content: JSON.stringify(about) }
                ]
            };

            await updateWebsiteContent("Homepage", payload);
            toast.success("Homepage configuration saved and published successfully!");
        } catch (error) {
            toast.error("Failed to save homepage configuration.");
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Loading Homepage Settings...</div>;

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                    <Title>Homepage Management</Title>
                    <p className="text-sm text-gray-500 mt-1">Configure and manage content for the public website homepage</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-colors">
                        <Eye className="w-4 h-4" /> Live Preview
                    </Button>
                    <Button onClick={handleSaveAll} className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95">
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
            </div>

            {/* Slider Section */}
            <Card className="shadow-sm border-gray-200/60 overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row justify-between items-center py-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" /> Hero Slider Config
                        </CardTitle>
                        <CardDescription>Upload images and text for the main landing page slider</CardDescription>
                    </div>
                    <Button onClick={() => { setCurrentSlide({ title: "", subtitle: "", image: "", active: true }); setSlideDialogMode("add"); setIsSlideDialogOpen(true); }} size="sm" className="flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add Slide
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {slides.map(slide => (
                            <div key={slide.id} className="group relative border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="h-44 w-full relative bg-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                                        <h4 className="font-bold text-lg leading-tight line-clamp-1">{slide.title}</h4>
                                        <p className="text-xs text-white/80 line-clamp-1">{slide.subtitle}</p>
                                    </div>
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-gray-800">
                                        {slide.active ? "Active" : "Inactive"}
                                    </div>
                                </div>
                                <div className="p-3 bg-white flex justify-between items-center border-t border-gray-50">
                                    <span className="text-xs text-gray-400">Slide ID: {slide.id}</span>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-600" onClick={() => handleEditSlide(slide)}>
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleDeleteSlide(slide.id)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Editor */}
                <Card className="lg:col-span-2 shadow-sm border-gray-200/60">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-600" /> Institution Quick Stats
                        </CardTitle>
                        <CardDescription>Key metrics displayed on the homepage banner</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={stat.id} className="space-y-1.5 p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{stat.label}</Label>
                                    <Input
                                        value={stat.value}
                                        onChange={(e) => {
                                            const updated = [...stats];
                                            updated[idx].value = e.target.value;
                                            setStats(updated);
                                        }}
                                        className="bg-white"
                                    />
                                </div>
                            ))}
                            {stats.length === 0 && (
                                <Button variant="outline" className="w-full md:col-span-2" onClick={() => setStats([
                                    { id: "1", label: "Institution BIN", value: "15005030", icon: "FileCheck" },
                                    { id: "2", label: "Institution Code", value: "NA", icon: "Building" },
                                    { id: "3", label: "Center Code", value: "NA", icon: "Building" },
                                    { id: "4", label: "Established Year", value: "2025", icon: "Clock" }
                                ])}>Initialize Default Stats Fields</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* About Institution Card */}
                <Card className="shadow-sm border-gray-200/60">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-indigo-600" /> About Snippet
                        </CardTitle>
                        <CardDescription>Summary of institution displayed on main page</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label>Section Title</Label>
                            <Input
                                value={about.title}
                                onChange={(e) => setAbout({ ...about, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Description text</Label>
                            <Textarea
                                value={about.description}
                                onChange={(e) => setAbout({ ...about, description: e.target.value })}
                                rows={5}
                                className="resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Principal Message Section */}
            <Card className="shadow-sm border-gray-200/60">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4">
                    <CardTitle className="text-lg font-bold text-gray-800">Message from the Principal</CardTitle>
                    <CardDescription>Manage the main message, image and title for the Principal Section</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4 flex flex-col justify-center items-center p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <div className="w-32 h-32 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative shadow-inner">
                                {principal.avatar ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={principal.avatar} alt="Principal" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl text-gray-400">👤</span>
                                )}
                            </div>
                            <Input 
                                placeholder="Avatar URL" 
                                value={principal.avatar}
                                onChange={(e) => setPrincipal({ ...principal, avatar: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Principal Name</Label>
                                    <Input
                                        value={principal.name}
                                        onChange={(e) => setPrincipal({ ...principal, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Designation</Label>
                                    <Input
                                        value={principal.designation}
                                        onChange={(e) => setPrincipal({ ...principal, designation: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Message Content</Label>
                                <Textarea
                                    value={principal.message}
                                    onChange={(e) => setPrincipal({ ...principal, message: e.target.value })}
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Slide dialog */}
            <Dialog open={isSlideDialogOpen} onOpenChange={setIsSlideDialogOpen}>
                <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle>{slideDialogMode === "add" ? "Add Slide" : "Edit Slide"}</DialogTitle>
                        <DialogDescription>Input title, subtitle and unsplash image url for slider preview</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="space-y-1.5">
                            <Label>Slide Title *</Label>
                            <Input
                                placeholder="E.g., Welcome to ePathshala"
                                value={currentSlide.title}
                                onChange={(e) => setCurrentSlide({ ...currentSlide, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Subtitle / Description</Label>
                            <Input
                                placeholder="E.g., Empowering students"
                                value={currentSlide.subtitle}
                                onChange={(e) => setCurrentSlide({ ...currentSlide, subtitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Image URL *</Label>
                            <Input
                                placeholder="E.g., https://images.unsplash.com/..."
                                value={currentSlide.image}
                                onChange={(e) => setCurrentSlide({ ...currentSlide, image: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded-lg bg-gray-50/50">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-700">Publish Slide</span>
                                <span className="text-xs text-gray-400">Make this slide visible on homepage</span>
                            </div>
                            <Switch
                                checked={currentSlide.active}
                                onCheckedChange={(val) => setCurrentSlide({ ...currentSlide, active: val })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSlideDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveSlide}>Save Slide</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
