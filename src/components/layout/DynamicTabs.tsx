import React from "react";

export type DynamicTab = {
    key: string; // e.g. "view-5" or "edit-7"
    label: string;
    content: React.ReactNode;
};

interface DynamicTabsProps {
    tabs: DynamicTab[];
    activeKey: string;
    onChange: (key: string) => void;
    onClose: (key: string) => void;
}

export default function DynamicTabs({ tabs, activeKey, onChange, onClose }: DynamicTabsProps) {
    if (tabs.length === 0) return null;
    return (
        <div>
            <div className="flex border-b bg-card">
                {tabs.map((tab) => (
                    <div
                        key={tab.key}
                        className={`px-4 py-2 cursor-pointer ${activeKey === tab.key ? "bg-background text-primary border-t border-x border-b-0 border-border" : "text-muted-foreground"}`}
                        onClick={() => onChange(tab.key)}
                    >
                        {tab.label}
                        <button
                            className="ml-2 text-xs text-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(tab.key);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <div className="p-4">{tabs.find((tab) => tab.key === activeKey)?.content}</div>
        </div>
    );
}
