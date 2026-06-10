"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { COOKIES_KEYS } from "@/configs/constants";
import { ApplicationContext } from "@/contexts/ApplicationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import Cookies from "js-cookie";
import { Bell, ChevronDown, KeyRound, LifeBuoy, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LanguageSwitcher from "../common/LanguageSwitcher";

interface TopbarProps {
    breadcrumbs?: string[];
    onMenuClick?: () => void;
    onSidebarToggle?: () => void;
    hasSidebar?: boolean;
    showFiscalYear?: boolean;
}

export default function Topbar({
    breadcrumbs = [],
    onMenuClick,
    onSidebarToggle,
    hasSidebar = true,
    showFiscalYear = true,
}: TopbarProps) {
    const { current_fiscal_year, fiscal_years, user } = useContext(ApplicationContext);

    const userInitials = user
        ? `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`.toUpperCase() ||
          "AD"
        : "AD";
    const { lng } = useLanguage();
    const { t } = useTranslationClient(lng);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const logoutLoading = false;
    const router = useRouter();

    // Build fiscal year options dynamically from API data
    const fiscalYearOptions = (fiscal_years || [])
        .filter((fy) => fy.name)
        .map((fy) => ({
            value: fy.name,
            label: fy.name,
        }));

    // If current_fiscal_year is an object, extract its name property
    const currentFiscalYearName =
        typeof current_fiscal_year === "string" ? current_fiscal_year : current_fiscal_year?.name;

    // Get fiscal year from cookie if present, else from prop, else fallback
    const getDefaultFiscalYear = () => {
        const cookieVal = Cookies.get("fiscal_year");
        if (cookieVal && fiscalYearOptions.some((opt) => opt.value === cookieVal)) {
            return cookieVal;
        }
        if (fiscalYearOptions.some((opt) => opt.value === currentFiscalYearName)) {
            return currentFiscalYearName;
        }
        return fiscalYearOptions[1]?.value;
    };
    const [selectedFiscalYear, setSelectedFiscalYear] = useState(getDefaultFiscalYear());

    // On mount, if no fiscal_year cookie, set it from props (if valid)
    useEffect(() => {
        const cookieVal = Cookies.get("fiscal_year");
        if (!cookieVal && fiscalYearOptions.some((opt) => opt.value === currentFiscalYearName)) {
            Cookies.set("fiscal_year", currentFiscalYearName, { expires: 365 });
            setSelectedFiscalYear(currentFiscalYearName);
        }
    }, []);

    // Set fiscal year in cookie when changed
    const handleFiscalYearChange = (val: string) => {
        setSelectedFiscalYear(val);
        Cookies.set("fiscal_year", val, { expires: 365 });
        window.location.reload();
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        if (!profileOpen) return;
        function handleClick(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                profileRef.current &&
                !profileRef.current.contains(e.target as Node)
            ) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [profileOpen]);

    const toggleDarkMode = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleLogout = async () => {
        Cookies.remove(COOKIES_KEYS.ACCESS_TOKEN);
        Cookies.remove(COOKIES_KEYS.REFRESH_TOKEN);
        Cookies.remove(COOKIES_KEYS.USER);
        Cookies.remove(COOKIES_KEYS.EXPIRY_TIME);
        toast.success(t("logout") + " " + t("login_successful").replace("Login", "").trim());
        router.push("/login");
    };

    if (!mounted) return null;

    return (
        <header className="h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between pl-1 font-[inherit]">
            {/* Left: Menu Button + Breadcrumbs */}
            <div className="flex items-center gap-3 pl-2">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors focus:ring-2 focus:ring-ring"
                    aria-label={t("search") || "Toggle menu"}
                >
                    <Menu className="w-5 h-5 text-sidebar-foreground" />
                </button>

                {/* Sidebar Toggle (for tablet/desktop) - only show if hasSidebar is true */}
                {hasSidebar && (
                    <SidebarTrigger className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors focus:ring-2 focus:ring-ring" />
                )}

                {/* Breadcrumbs */}
                <nav className="hidden md:flex items-center space-x-2 text-sm text-sidebar-foreground/70 font-medium font-[inherit]">
                    {breadcrumbs
                        .filter((crumb) => isNaN(Number(crumb))) // Filter out numeric segments
                        .map((crumb, index, arr) => (
                            <div key={index} className="flex items-center">
                                {index > 0 && (
                                    <span className="mx-2 text-sidebar-foreground/50">›</span>
                                )}
                                <span
                                    className={
                                        index === arr.length - 1
                                            ? "font-semibold text-sidebar-foreground"
                                            : "text-sidebar-foreground/70"
                                    }
                                >
                                    {t(crumb.toLowerCase().replace(/\s+/g, "_")) || crumb}
                                </span>
                            </div>
                        ))}
                </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-4 px-4">
                {/* Fiscal Year - Hidden on mobile, only show if showFiscalYear is true */}
                {showFiscalYear && (
                    <div className="hidden md:block">
                        <Select value={selectedFiscalYear} onValueChange={handleFiscalYearChange}>
                            <SelectTrigger className="w-[180px] text-xs font-semibold bg-background border border-input">
                                <SelectValue placeholder={t("select_fiscal_year")} />
                            </SelectTrigger>
                            <SelectContent>
                                {fiscalYearOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Search - Hidden on small screens */}
                {/* <button className="hidden sm:block p-2 hover:bg-sidebar-accent rounded-lg transition-colors focus:ring-2 focus:ring-ring" title="Search" aria-label="Search">
          <Search className="w-5 h-5 text-sidebar-foreground" />
        </button> */}
                {/* Language Switcher */}
                <LanguageSwitcher />
                {/* Dark/Light Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="hidden sm:flex items-center gap-1 p-2 hover:bg-sidebar-accent rounded-lg transition-colors transition-transform hover:scale-110 focus:ring-2 focus:ring-ring cursor-pointer text-sidebar-foreground"
                    title={theme === "dark" ? t("login_successful") : t("operation_failed")}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-yellow-400 hover:text-white transition-transform duration-200" />
                    ) : (
                        <Moon className="w-5 h-5 text-slate-600  transition-transform duration-200" />
                    )}
                </button>

                {/* Notifications */}
                <button
                    className="relative p-2 hover:bg-sidebar-accent rounded-lg transition-colors focus:ring-2 focus:ring-ring"
                    title="Notifications"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5 text-sidebar-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full ring-2 ring-sidebar"></span>
                </button>

                {/* User Profile */}
                <div className="relative">
                    <button
                        ref={profileRef}
                        onClick={() => setProfileOpen((v) => !v)}
                        className="flex items-center gap-2 p-1 pr-3 hover:bg-sidebar-accent rounded-md transition-colors focus:ring-2 focus:ring-ring group cursor-pointer"
                        aria-haspopup="true"
                        aria-label="User profile menu"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-inner group-hover:scale-105 transition-transform">
                            {userInitials}
                        </div>
                        <ChevronDown className="w-4 h-4 text-sidebar-foreground/70" />
                    </button>
                    {/* Dropdown */}
                    {profileOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-xl shadow-xl py-2 z-50 animate-fade-in font-[inherit]"
                        >
                            {/* User info header */}
                            <div className="px-4 py-2.5 mb-1">
                                <p className="text-sm font-semibold text-foreground leading-tight">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                    {user?.username || "Administrator"}
                                </p>
                            </div>
                            <div className="h-px bg-border mx-3 mb-1" />

                            {/* My Profile */}
                            <button
                                onClick={() => { setProfileOpen(false); router.push("/profile"); }}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-sidebar-accent rounded-md transition-colors flex items-center gap-2.5 cursor-pointer mx-1 w-[calc(100%-8px)]"
                            >
                                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span>{t("my_profile")}</span>
                            </button>

                            {/* Change Password */}
                            <button
                                onClick={() => { setProfileOpen(false); router.push("/change-password"); }}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-sidebar-accent rounded-md transition-colors flex items-center gap-2.5 cursor-pointer mx-1 w-[calc(100%-8px)]"
                            >
                                <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span>{t("change_password") || "Change Password"}</span>
                            </button>

                            {/* Support */}
                            <button
                                onClick={() => { setProfileOpen(false); router.push("/support"); }}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-sidebar-accent rounded-md transition-colors flex items-center gap-2.5 cursor-pointer mx-1 w-[calc(100%-8px)]"
                            >
                                <LifeBuoy className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span>{t("support") || "Support"}</span>
                            </button>

                            <div className="h-px bg-border mx-3 my-1" />

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                disabled={logoutLoading}
                                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors flex items-center gap-2.5 cursor-pointer mx-1 w-[calc(100%-8px)]"
                            >
                                <LogOut className="w-4 h-4 shrink-0" />
                                <span>{t("logout")}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
