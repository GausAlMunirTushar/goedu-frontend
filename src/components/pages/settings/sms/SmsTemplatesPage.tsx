"use client";

import {
    createSmsTemplate,
    deleteSmsTemplate,
    updateSmsTemplate,
} from "@/apis/mutations/sms_mutations";
import { useSmsTemplatesQuery } from "@/apis/queries/sms_queries";
import type { SmsSourceType } from "@/apis/types/sms_type";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const emptyForm = { name: "", sourceType: "manual" as SmsSourceType, body: "", isActive: true };

export function SmsTemplatesPage() {
    const { data, mutate } = useSmsTemplatesQuery();
    const templates = data?.data || [];
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);

    const save = async () => {
        if (!form.name || !form.body) {
            toast.error("Template name and body are required");
            return;
        }
        try {
            if (editingId) await updateSmsTemplate(editingId, form);
            else await createSmsTemplate(form);
            toast.success("Template saved");
            setEditingId(null);
            setForm(emptyForm);
            mutate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save template");
        }
    };

    return (
        <div className="space-y-6 p-6">
            <Title>SMS Templates</Title>
            <Card>
                <CardContent className="grid gap-3 p-6 md:grid-cols-[1fr_180px]">
                    <Input
                        placeholder="Template name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <Select
                        value={form.sourceType}
                        onValueChange={(value: SmsSourceType) =>
                            setForm({ ...form, sourceType: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="attendance">Attendance</SelectItem>
                            <SelectItem value="result">Result</SelectItem>
                            <SelectItem value="notice">Notice</SelectItem>
                        </SelectContent>
                    </Select>
                    <Textarea
                        className="md:col-span-2"
                        rows={4}
                        placeholder="Template body with {{studentName}}, {{status}}, {{examName}}, {{noticeTitle}}"
                        value={form.body}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                    />
                    <div className="flex gap-2 md:col-span-2">
                        <Button onClick={save}>
                            {editingId ? "Update Template" : "Create Template"}
                        </Button>
                        {editingId && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingId(null);
                                    setForm(emptyForm);
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-3">
                {templates.map((template) => (
                    <Card key={template.id}>
                        <CardContent className="flex flex-col justify-between gap-3 p-4 md:flex-row md:items-center">
                            <div>
                                <p className="font-semibold">{template.name}</p>
                                <p className="text-xs uppercase text-muted-foreground">
                                    {template.sourceType}
                                </p>
                                <p className="mt-2 text-sm">{template.body}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingId(template.id);
                                        setForm({
                                            name: template.name,
                                            sourceType: template.sourceType,
                                            body: template.body,
                                            isActive: template.isActive,
                                        });
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={async () => {
                                        await deleteSmsTemplate(template.id);
                                        mutate();
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
