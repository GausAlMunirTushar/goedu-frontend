import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User, FolderOpen, Bell, Download } from "lucide-react";
import { notices } from "@/data/notices";
import { notFound } from "next/navigation";

export default async function NoticeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const notice = notices.find(n => n.id === resolvedParams.id);

    if (!notice) {
        notFound();
    }

    const otherNotices = notices.filter(n => n.id !== notice.id).slice(0, 4);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div className="bg-primary/5 py-8 md:py-12 border-b border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto px-4">
                    <Link href="/academic/notices" className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:text-primary/80 transition-colors mb-6 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Notices
                    </Link>
                    
                    <div className="max-w-4xl">
                        {notice.isNew && (
                            <div className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                                NEW
                            </div>
                        )}
                        
                        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                            {notice.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span>{notice.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100">
                                <FolderOpen className="w-4 h-4 text-primary" />
                                <span>{notice.category}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100">
                                <User className="w-4 h-4 text-primary" />
                                <span>{notice.publishedBy}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Content area */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10">
                            <div className="prose prose-lg max-w-none text-gray-700">
                                <p className="whitespace-pre-line leading-relaxed text-lg">
                                    {notice.fullContent || notice.description}
                                </p>
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Bell className="w-5 h-5 text-gray-400" />
                                    <p>For any queries, please contact the administration office.</p>
                                </div>
                                <button className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Recent Notices</h3>
                            
                            <div className="space-y-4">
                                {otherNotices.map((other) => (
                                    <Link key={other.id} href={`/academic/notices/${other.id}`} className="group block p-4 rounded-xl border border-gray-100 hover:border-primary/30 bg-gray-50/50 hover:bg-primary/5 transition-all">
                                        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 font-medium">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            <span>{other.date}</span>
                                            {other.isNew && (
                                                <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors line-clamp-2">
                                            {other.title}
                                        </h4>
                                    </Link>
                                ))}
                            </div>
                            
                            <Link href="/academic/notices" className="mt-6 w-full text-center block text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-3 rounded-xl transition-colors">
                                View All Notices
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
