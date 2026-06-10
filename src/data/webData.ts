export const topBarData = {
    email: "divine.edu.info@gmail.com",
    phone: "01712086101",
    noticeText: "ক্লাস রুটিন",
    socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        youtube: "#"
    },
    admissionLink: "#",
    loginLink: "/login"
};

export const webHeaderData = {
    establishedLabelKey: "established",
    establishedYear: "2025",
    schoolName: "ePathshala",
    schoolNameEn: "ePathshala",
    schoolNameBn: "ই-পাঠশালা",
    address: "Dhaka, Bangladesh",
    addressBn: "ঢাকা, বাংলাদেশ",
    infoColumns: [
        { labelKey: "institution_bin", value: "১৫০০০৫৩০", defaultLabel: "প্রতিষ্ঠান বিন নং" },
        { labelKey: "institution_code", value: "N/A", defaultLabel: "শিক্ষা প্রতিষ্ঠান কোড" },
        { labelKey: "center_code", value: "N/A", defaultLabel: "সেন্টার কোড" },
        { labelKey: "established", value: "২০২৫", defaultLabel: "প্রতিষ্ঠাকাল" },
    ],
    navLinks: [
        { labelKey: "home", href: "/", defaultLabel: "হোম" },
        { 
            labelKey: "about_us", 
            href: "/about", 
            defaultLabel: "আমাদের সম্পর্কে",
            children: [
                { labelKey: "institution_info", href: "/about", defaultLabel: "প্রতিষ্ঠানের তথ্য" }
            ]
        },
        { 
            labelKey: "academic", 
            href: "#", 
            defaultLabel: "একাডেমিক",
            children: [
                { labelKey: "notices", href: "/academic/notices", defaultLabel: "নোটিশ বোর্ড", group: "Information" },
                { labelKey: "teachers", href: "/academic/teachers", defaultLabel: "শিক্ষকমণ্ডলী", group: "Information" },
                { labelKey: "class_schedule", href: "/academic/class-schedule", defaultLabel: "ক্লাস রুটিন", group: "Schedule", separator: true },
                { labelKey: "academic_calendar", href: "/academic/academic-calendar", defaultLabel: "একাডেমিক ক্যালেন্ডার", group: "Schedule" },
                { labelKey: "syllabus", href: "#", defaultLabel: "সিলেবাস", group: "Resources", separator: true },
                { labelKey: "facilities", href: "#", defaultLabel: "সুযোগ-সুবিধা", group: "Resources" }
            ]
        },
        { 
            labelKey: "admission_info", 
            href: "#", 
            defaultLabel: "ভর্তি তথ্য",
            children: [
                { labelKey: "admission_form", href: "#", defaultLabel: "ভর্তি আবেদন" },
                { labelKey: "admission_rules", href: "#", defaultLabel: "ভর্তির নিয়মাবলী" },
                { labelKey: "fees", href: "#", defaultLabel: "ফি সমূহ" }
            ]
        },
        { 
            labelKey: "students", 
            href: "#", 
            defaultLabel: "ছাত্র-ছাত্রী",
            children: [
                { labelKey: "students_list",  href: "/students/students-list",  defaultLabel: "শিক্ষার্থী তালিকা" },
                { labelKey: "exam_result",    href: "/students/exam-result",    defaultLabel: "পরীক্ষার ফলাফল",  separator: true },
                { labelKey: "exam_schedule",  href: "/students/exam-schedule",  defaultLabel: "পরীক্ষার সময়সূচি" }
            ]
        },
        { labelKey: "others", href: "#", defaultLabel: "অন্যান্য" },
        { labelKey: "contact", href: "/contact", defaultLabel: "যোগাযোগ" },
    ]
};
