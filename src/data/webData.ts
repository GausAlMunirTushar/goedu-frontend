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
    establishedYear: "২০২৫",
    schoolName: "ডিভাইন ইন্টারন্যাশনাল স্কুল",
    address: "ডোমার রোড, নীলফামারী, ডোমার, নীলফামারী",
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
            href: "#", 
            defaultLabel: "আমাদের সম্পর্কে",
            children: [
                { labelKey: "institution_info", href: "#", defaultLabel: "প্রতিষ্ঠানের তথ্য" }
            ]
        },
        { 
            labelKey: "academic", 
            href: "#", 
            defaultLabel: "একাডেমিক",
            children: [
                { labelKey: "teachers", href: "#", defaultLabel: "শিক্ষকমণ্ডলী" },
                { labelKey: "class_routine", href: "#", defaultLabel: "ক্লাস রুটিন" },
                { labelKey: "syllabus", href: "#", defaultLabel: "সিলেবাস" },
                { labelKey: "facilities", href: "#", defaultLabel: "সুযোগ-সুবিধা" }
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
                { labelKey: "results", href: "#", defaultLabel: "ফলাফল" }
            ]
        },
        { labelKey: "others", href: "#", defaultLabel: "অন্যান্য" },
        { labelKey: "contact", href: "#", defaultLabel: "যোগাযোগ" },
    ]
};
