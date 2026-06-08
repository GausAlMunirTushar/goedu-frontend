"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { OctagonX, RotateCcw } from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("[GlobalError]", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="flex flex-col items-center gap-6 max-w-md text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                    <OctagonX className="w-8 h-8 text-destructive" />
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
                    <p className="text-sm text-muted-foreground">
                        An unexpected error occurred. Please try again or contact support if the
                        problem persists.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground font-mono mt-1">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                <Button onClick={reset} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Try again
                </Button>
            </div>
        </div>
    );
}
