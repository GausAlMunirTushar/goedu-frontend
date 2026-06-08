"use client";

import React from "react";

import { cn } from "@/lib/utils";

export type LoaderVariant = "spinner" | "dots" | "pulse" | "orbit" | "bars";
export type LoaderSize = "sm" | "md" | "lg" | "xl";

interface LoaderProps {
    /** Variant of the loader animation */
    variant?: LoaderVariant;
    /** Size of the loader */
    size?: LoaderSize;
    /** Optional text to display below the loader */
    text?: string;
    /** Optional description text to show what's running in the background */
    description?: string;
    /** Whether to center the loader in fullscreen */
    fullscreen?: boolean;
    /** Custom className */
    className?: string;
    /** Color variant */
    color?: "primary" | "success" | "warning" | "danger";
}

const sizeMap: Record<LoaderSize, { container: string; element: string }> = {
    sm: { container: "w-6 h-6", element: "w-1.5 h-1.5" },
    md: { container: "w-10 h-10", element: "w-2.5 h-2.5" },
    lg: { container: "w-16 h-16", element: "w-4 h-4" },
    xl: { container: "w-24 h-24", element: "w-6 h-6" },
};

const colorMap = {
    primary: "border-primary-500 bg-primary-500",
    success: "border-success bg-success",
    warning: "border-warning bg-warning",
    danger: "border-danger bg-danger",
};

const Loader: React.FC<LoaderProps> = ({
    variant = "orbit",
    description,
    size = "md",
    text,
    fullscreen = false,
    className,
    color = "primary",
}) => {
    const renderLoader = () => {
        const baseColor = colorMap[color];
        const sizes = sizeMap[size];

        switch (variant) {
            case "spinner":
                return (
                    <div
                        className={cn(
                            "rounded-full border-4 border-gray-200 border-t-transparent animate-spin",
                            sizes.container,
                            baseColor.split(" ")[0],
                        )}
                        style={{
                            borderTopColor: color === "primary" ? "#7C82E9" : undefined,
                        }}
                    />
                );

            case "dots":
                return (
                    <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={cn(
                                    "rounded-full animate-bounce",
                                    sizes.element,
                                    baseColor.split(" ")[1],
                                )}
                                style={{
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: "0.6s",
                                }}
                            />
                        ))}
                    </div>
                );

            case "pulse":
                return (
                    <div className="relative flex items-center justify-center">
                        <div
                            className={cn(
                                "rounded-full animate-ping absolute opacity-75",
                                sizes.container,
                                baseColor.split(" ")[1],
                            )}
                        />
                        <div
                            className={cn(
                                "rounded-full relative",
                                sizes.container,
                                baseColor.split(" ")[1],
                            )}
                        />
                    </div>
                );

            case "orbit":
                return (
                    <div className={cn("relative", sizes.container)}>
                        {/* Central circle */}
                        <div
                            className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                                sizes.element,
                                baseColor.split(" ")[1],
                            )}
                        />
                        {/* Orbiting circles */}
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="absolute inset-0 animate-spin"
                                style={{
                                    animationDuration: `${1.5 + i * 0.3}s`,
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            >
                                <div
                                    className={cn(
                                        "rounded-full absolute top-0 left-1/2 -translate-x-1/2",
                                        size === "sm"
                                            ? "w-1 h-1"
                                            : size === "md"
                                              ? "w-1.5 h-1.5"
                                              : size === "lg"
                                                ? "w-2 h-2"
                                                : "w-3 h-3",
                                        baseColor.split(" ")[1],
                                    )}
                                    style={{ opacity: 1 - i * 0.25 }}
                                />
                            </div>
                        ))}
                    </div>
                );

            case "bars":
                return (
                    <div className="flex items-end space-x-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={cn(
                                    "rounded-sm animate-pulse",
                                    size === "sm"
                                        ? "w-0.5 h-4"
                                        : size === "md"
                                          ? "w-1 h-6"
                                          : size === "lg"
                                            ? "w-1.5 h-10"
                                            : "w-2 h-14",
                                    baseColor.split(" ")[1],
                                )}
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "0.8s",
                                }}
                            />
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    const loaderContent = (
        <div className="flex flex-col items-center justify-center gap-4">
            {renderLoader()}
            {(text || description) && (
                <div className="flex flex-col items-center gap-2 max-w-md text-center">
                    {text && (
                        <p className="text-text-dark dark:text-white text-base font-semibold">
                            {text}
                        </p>
                    )}
                    {description && (
                        <p className="text-text-muted text-sm font-medium animate-pulse">
                            {description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );

    if (fullscreen) {
        return (
            <div
                className={cn(
                    "fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-body_dark/80 backdrop-blur-sm",
                    className,
                )}
            >
                {loaderContent}
            </div>
        );
    }

    return <div className={cn("flex items-center justify-center", className)}>{loaderContent}</div>;
};

export default Loader;
