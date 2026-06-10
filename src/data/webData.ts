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
    admissionLink: "/online-admission",
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
                { labelKey: "principal_message", href: "/about/principal-message", defaultLabel: "অধ্যক্ষের বাণী", group: "Leadership" },
                { labelKey: "head_teacher_message", href: "/about/head-teacher-message", defaultLabel: "প্রধান শিক্ষকের বাণী", group: "Leadership" },
                { labelKey: "institution_info", href: "/about", defaultLabel: "প্রতিষ্ঠানের তথ্য", group: "Institution", separator: true },
                { labelKey: "history", href: "/about/history", defaultLabel: "ইতিহাস", group: "Institution" },
                { labelKey: "mission_vision", href: "/about/mission-vision", defaultLabel: "লক্ষ্য ও উদ্দেশ্য", group: "Institution" },
                { labelKey: "managing_committee", href: "/about/managing-committee", defaultLabel: "ব্যবস্থাপনা কমিটি", group: "Governance", separator: true }
            ]
        },
        { 
            labelKey: "academic", 
            href: "#", 
            defaultLabel: "একাডেমিক",
            children: [
                { labelKey: "notices", href: "/academic/notices", defaultLabel: "নোটিশ বোর্ড" },
                { labelKey: "teachers", href: "/academic/teachers", defaultLabel: "শিক্ষকমণ্ডলী" },
                { labelKey: "class_schedule", href: "/academic/class-schedule", defaultLabel: "ক্লাস রুটিন", separator: true },
                { labelKey: "academic_calendar", href: "/academic/academic-calendar", defaultLabel: "একাডেমিক ক্যালেন্ডার" },
                { labelKey: "syllabus", href: "/academic/syllabus", defaultLabel: "সিলেবাস", separator: true },
                { labelKey: "facilities", href: "/academic/facilities", defaultLabel: "সুযোগ-সুবিধা" }
            ]
        },
        { 
            labelKey: "admission", 
            href: "#", 
            defaultLabel: "ভর্তি",
            children: [
                { labelKey: "admission_form", href: "/online-admission", defaultLabel: "ভর্তি আবেদন" },
                { labelKey: "admission_rules", href: "/online-admission/rules", defaultLabel: "ভর্তির নিয়মাবলী" },
                { labelKey: "fees", href: "/online-admission/fees", defaultLabel: "ফি সমূহ" }
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
        { labelKey: "gallery", href: "/gallery", defaultLabel: "গ্যালারি" },
        { labelKey: "contact", href: "/contact", defaultLabel: "যোগাযোগ" },
    ]
};
