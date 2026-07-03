import {
    Award,
    BadgeDollarSign,
    Banknote,
    BarChart,
    Bell,
    BookOpen,
    Briefcase,
    Building,
    Building2,
    MapPin,
    CalculatorIcon,
    Calendar,
    CalendarDays,
    ChartLine,
    ChartNoAxesCombined,
    ChartPie,
    ClipboardList,
    Coins,
    CreditCard,
    Database,
    DollarSign,
    Droplets,
    FileCheck,
    Globe,
    FileSpreadsheet,
    FileText,
    FileUser,
    GraduationCap,
    HandCoins,
    HeartPulse,
    Home,
    IdCard,
    Image,
    Landmark,
    LayoutDashboard,
    LayoutTemplate,
    LucideIcon,
    Monitor,
    Palette,
    Phone,
    Receipt,
    Settings,
    ShieldCheck,
    ShieldUser,
    Sparkles,
    TrendingUp,
    UserCheck,
    UserCog,
    UserRound,
    Users,
    Users2,
    SwatchBook,
    UserPlus,
    User,
    Repeat,
} from "lucide-react";

import { LiaClipboardListSolid, LiaLandmarkSolid } from "react-icons/lia";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { GrPieChart } from "react-icons/gr";
import { PiCertificateLight, PiHandsClapping } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { TbPasswordFingerprint } from "react-icons/tb";

type IconName =
    | "UsersIcon"
    | "LayoutDashboardIcon"
    | "DatabaseIcon"
    | "BuildingIcon"
    | "IdCardIcon"
    | "Users2Icon"
    | "BriefcaseIcon"
    | "FileUserIcon"
    | "CalendarIcon"
    | "BanknoteIcon"
    | "CoinsIcon"
    | "Home"
    | "Globe"
    | "Users"
    | "UserPlus"
    | "User"
    | "Repeat"
    | "GraduationCap"
    | "DollarSign"
    | "BookOpen"
    | "Calendar"
    | "FileText"
    | "FileSpreadsheet"
    | "FileCheck"
    | "Settings"
    | "BadgeDollarSign"
    | "LiaLandmarkSolid"
    | "FaRegMoneyBillAlt"
    | "ShieldCheck"
    | "ChartNoAxesCombined"
    | "UserRound"
    | "UserCheck"
    | "CreditCard"
    | "UserCog"
    | "CalculatorIcon"
    | "ChartLine"
    | "ShieldUser"
    | "GrPieChart"
    | "HandCoins"
    | "HeartPulse"
    | "Generate"
    | "Receipt"
    | "Building2"
    | "Image"
    | "Phone"
    | "TrendingUp"
    | "Palette"
    | "Monitor"
    | "Droplets"
    | "LayoutTemplate"
    | "Award"
    | "LayoutDashboard"
    | "PiCertificateLight"
    | "CgProfile"
    | "TbPasswordFingerprint"
    | "PiHandsClapping"
    | "LiaClipboardListSolid"
    | "ChartPie"
    | "Landmark"
    | "ClipboardList"
    | "CalendarDays"
    | "BarChart"
    | "Bell"
    | "FaBangladeshiTakaSign"
    | "MdOutlinePayments"
    | "SwatchBook"
    | "MapPin"
    | "TeacherIcon"
    | "TeacherDesignationsIcon";

const iconMap: Record<IconName, LucideIcon> = {
    UsersIcon: Users,
    LayoutDashboardIcon: LayoutDashboard,
    DatabaseIcon: Database,
    BuildingIcon: Building,
    TeacherIcon: Users as unknown as LucideIcon,
    TeacherDesignationsIcon: UserCog as unknown as LucideIcon,
    IdCardIcon: IdCard,
    Users2Icon: Users2,
    BriefcaseIcon: Briefcase,
    FileUserIcon: FileUser,
    CalendarIcon: Calendar,
    BanknoteIcon: Banknote,
    CoinsIcon: Coins,
    Home: Home,
    Globe: Globe,
    Users: Users,
    UserPlus: UserPlus,
    User: User,
    Repeat: Repeat,
    GraduationCap: GraduationCap,
    DollarSign: DollarSign,
    BookOpen: BookOpen,
    Calendar: Calendar,
    FileText: FileText,
    FileSpreadsheet: FileSpreadsheet,
    FileCheck: FileCheck,
    Settings: Settings,
    BadgeDollarSign: BadgeDollarSign,
    LiaLandmarkSolid: LiaLandmarkSolid as unknown as LucideIcon,
    FaRegMoneyBillAlt: FaRegMoneyBillAlt as unknown as LucideIcon,
    ShieldCheck: ShieldCheck,
    ChartNoAxesCombined: ChartNoAxesCombined,
    UserRound: UserRound,
    UserCheck: UserCheck,
    CreditCard: CreditCard,
    UserCog: UserCog,
    ChartLine: ChartLine,
    CalculatorIcon: CalculatorIcon,
    ShieldUser: ShieldUser,
    GrPieChart: GrPieChart as unknown as LucideIcon,
    HandCoins: HandCoins,
    HeartPulse: HeartPulse,
    Generate: Sparkles,
    Receipt: Receipt,
    Building2: Building2,
    MapPin: MapPin,
    Image: Image,
    Phone: Phone,
    TrendingUp: TrendingUp,
    Palette: Palette,
    Monitor: Monitor,
    Droplets: Droplets,
    LayoutTemplate: LayoutTemplate,
    Award: Award,
    LayoutDashboard: LayoutDashboard,
    PiCertificateLight: PiCertificateLight as unknown as LucideIcon,
    CgProfile: CgProfile as unknown as LucideIcon,
    TbPasswordFingerprint: TbPasswordFingerprint as unknown as LucideIcon,
    PiHandsClapping: PiHandsClapping as unknown as LucideIcon,
    LiaClipboardListSolid: LiaClipboardListSolid as unknown as LucideIcon,
    ChartPie: ChartPie as unknown as LucideIcon,
    Landmark: Landmark as unknown as LucideIcon,
    ClipboardList: ClipboardList as unknown as LucideIcon,
    CalendarDays: CalendarDays as unknown as LucideIcon,
    BarChart,
    Bell,
    FaBangladeshiTakaSign: FaRegMoneyBillAlt as unknown as LucideIcon,
    MdOutlinePayments: FaRegMoneyBillAlt as unknown as LucideIcon,
    SwatchBook: SwatchBook,
};

export function getIcon(iconName: string): LucideIcon | null {
    return iconMap[iconName as IconName] || null;
}
