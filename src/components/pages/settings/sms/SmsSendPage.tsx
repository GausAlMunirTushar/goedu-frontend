"use client";

import type { SmsSendPayload } from "@/apis/types/sms_type";
import Title from "@/components/ui/custom-ui/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import { SmsPreviewDialog } from "./SmsPreviewDialog";

export function SmsSendPage() {
    const [numbers, setNumbers] = useState("");
    const [message, setMessage] = useState("");
    const [payload, setPayload] = useState<SmsSendPayload | null>(null);
    const [open, setOpen] = useState(false);

    const unitInfo = useMemo(() => {
        const isGsm = /^[\u000A\u000D\u0020-\u007E]*$/.test(message);
        const perUnit = isGsm ? 160 : 70;
        return {
            encoding: isGsm ? "GSM" : "Unicode",
            units: Math.max(1, Math.ceil(message.length / perUnit)),
        };
    }, [message]);

    const handlePreview = () => {
        setPayload({
            sourceType: "manual",
            message,
            recipients: numbers
                .split(/[,\n]/)
                .map((number) => number.trim())
                .filter(Boolean)
                .map((number) => ({ number })),
        });
        setOpen(true);
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <Title>Send SMS</Title>
                <p className="text-sm text-muted-foreground">
                    Send manual SMS to comma or line-separated numbers.
                </p>
            </div>
            <Card>
                <CardContent className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label>Recipients</Label>
                        <Textarea
                            rows={5}
                            value={numbers}
                            onChange={(e) => setNumbers(e.target.value)}
                            placeholder="017XXXXXXXX, 88018XXXXXXXX"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write SMS message..."
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{message.length} characters</span>
                            <span>
                                {unitInfo.encoding}, {unitInfo.units} unit(s) per recipient
                            </span>
                        </div>
                    </div>
                    <Button onClick={handlePreview} disabled={!numbers.trim() || !message.trim()}>
                        <Send className="size-4" /> Preview & Send
                    </Button>
                </CardContent>
            </Card>
            <SmsPreviewDialog open={open} payload={payload} onOpenChange={setOpen} />
        </div>
    );
}
