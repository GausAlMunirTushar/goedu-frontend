"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslationClient } from "@/lib/i18n/client";
import { classes, sessions } from "@/data/academic";
import { 
  User, 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  UploadCloud, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  Printer, 
  Download,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Multi-step form wizard
export default function OnlineAdmission() {
  const { lng } = useLanguage();
  const { t } = useTranslationClient(lng);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [birthCertPreview, setBirthCertPreview] = useState<string | null>(null);
  
  // Generated Registration Info
  const [registrationSlip, setRegistrationSlip] = useState<{
    applicationId: string;
    date: string;
    studentName: string;
    appliedClass: string;
    session: string;
    mobile: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Student Details
    studentNameEn: "",
    studentNameBn: "",
    dob: "",
    gender: "Male",
    bloodGroup: "A+",
    religion: "Islam",
    nationality: "Bangladeshi",
    
    // Academic Details
    appliedClass: classes[6]?.name || "Class 6",
    session: sessions[4]?.name || "2025-2026",
    medium: "Bangla",
    prevSchool: "",
    prevClass: "",
    prevGpa: "",

    // Guardian Details
    fatherName: "",
    fatherPhone: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherOccupation: "",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",

    // Contact Details
    presentAddress: "",
    permanentAddress: "",
    email: "",
    mobile: "",

    // Agreement
    declaration: false,
    signatureName: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'birthCert') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'photo') {
          setPhotoPreview(reader.result as string);
        } else {
          setBirthCertPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Localized texts
  const strings = {
    title: lng === "bn" ? "অনলাইন ভর্তি আবেদন ফরম" : "Online Admission Form",
    subtitle: lng === "bn" ? "ই-পাঠশালায় ভর্তির জন্য আবেদন ফরমটি সতর্কতার সাথে পূরণ করুন" : "Please fill out the application form carefully for admission to ePathshala",
    
    step1: lng === "bn" ? "শিক্ষার্থীর তথ্য" : "Student Details",
    step2: lng === "bn" ? "একাডেমিক তথ্য" : "Academic Info",
    step3: lng === "bn" ? "অভিভাবক ও যোগাযোগ" : "Parents & Contact",
    step4: lng === "bn" ? "ঘোষণা ও দাখিল" : "Review & Submit",
    step5: lng === "bn" ? "আবেদনপত্র স্লিপ" : "Application Slip",

    personalHeader: lng === "bn" ? "ব্যক্তিগত বিবরণ" : "Personal Details",
    studentNameEnLabel: lng === "bn" ? "শিক্ষার্থীর নাম (ইংরেজিতে)" : "Student Name (In English)",
    studentNameBnLabel: lng === "bn" ? "শিক্ষার্থীর নাম (বাংলায়)" : "Student Name (In Bengali)",
    dobLabel: lng === "bn" ? "জন্ম তারিখ" : "Date of Birth",
    genderLabel: lng === "bn" ? "লিঙ্গ" : "Gender",
    bloodGroupLabel: lng === "bn" ? "রক্তের গ্রুপ" : "Blood Group",
    religionLabel: lng === "bn" ? "ধর্ম" : "Religion",
    nationalityLabel: lng === "bn" ? "জাতীয়তা" : "Nationality",
    photoLabel: lng === "bn" ? "শিক্ষার্থীর ছবি আপলোড করুন" : "Upload Student Photo",

    academicHeader: lng === "bn" ? "ভর্তি ও একাডেমিক তথ্য" : "Admission & Academic Details",
    appliedClassLabel: lng === "bn" ? "আবেদনকৃত শ্রেণী" : "Applied Class",
    sessionLabel: lng === "bn" ? "শিক্ষাবর্ষ/সেশন" : "Academic Session",
    mediumLabel: lng === "bn" ? "মাধ্যম" : "Medium",
    prevSchoolLabel: lng === "bn" ? "পূর্ববর্তী বিদ্যালয়ের নাম (যদি থাকে)" : "Previous School Name (If any)",
    prevClassLabel: lng === "bn" ? "পূর্ববর্তী শ্রেণী" : "Previous Class",
    prevGpaLabel: lng === "bn" ? "পূর্ববর্তী জিপিএ/রোল নং" : "Previous GPA / Roll No.",
    birthCertLabel: lng === "bn" ? "জন্ম নিবন্ধন সনদ আপলোড করুন (ছবি/পিডিএফ)" : "Upload Birth Certificate (Image/PDF)",

    guardianHeader: lng === "bn" ? "পিতা ও মাতার বিবরণ" : "Parents Details",
    fatherNameLabel: lng === "bn" ? "পিতার নাম" : "Father's Name",
    fatherOccupationLabel: lng === "bn" ? "পিতার পেশা" : "Father's Occupation",
    fatherPhoneLabel: lng === "bn" ? "পিতার মোবাইল নম্বর" : "Father's Phone No.",
    motherNameLabel: lng === "bn" ? "মাতার নাম" : "Mother's Name",
    motherOccupationLabel: lng === "bn" ? "মাতার পেশা" : "Mother's Occupation",
    motherPhoneLabel: lng === "bn" ? "মাতার মোবাইল নম্বর" : "Mother's Phone No.",
    
    guardianSubHeader: lng === "bn" ? "জরুরী যোগাযোগ / বিকল্প অভিভাবক" : "Emergency Contact / Alternative Guardian",
    guardianNameLabel: lng === "bn" ? "অভিভাবকের নাম" : "Guardian's Name",
    guardianRelationLabel: lng === "bn" ? "শিক্ষার্থীর সাথে সম্পর্ক" : "Relationship with Student",
    guardianPhoneLabel: lng === "bn" ? "অভিভাবকের মোবাইল নম্বর" : "Guardian's Phone No.",

    contactHeader: lng === "bn" ? "ঠিকানা ও যোগাযোগের তথ্য" : "Address & Contact Information",
    mobileLabel: lng === "bn" ? "আবেদনকারীর মোবাইল নম্বর (প্রধান)" : "Applicant Mobile Number (Primary)",
    emailLabel: lng === "bn" ? "ইমেইল এড্রেস (ঐচ্ছিক)" : "Email Address (Optional)",
    presentAddressLabel: lng === "bn" ? "বর্তমান ঠিকানা" : "Present Address",
    permanentAddressLabel: lng === "bn" ? "স্থায়ী ঠিকানা" : "Permanent Address",

    reviewHeader: lng === "bn" ? "ঘোষণা ও চুক্তিপত্র" : "Declaration & Agreement",
    reviewSubtitle: lng === "bn" ? "ফর্ম দাখিল করার পূর্বে সমস্ত তথ্য যাচাই করে নিন।" : "Please verify all information before submitting the form.",
    declarationText: lng === "bn" ? "আমি এই মর্মে অঙ্গীকার করছি যে, উপরে বর্ণিত তথ্য সম্পূর্ণ সত্য। যেকোনো ভুল তথ্যের কারণে আমার ভর্তি বাতিল বলে গণ্য হতে পারে।" : "I hereby declare that the information provided above is true and accurate. Any false details may lead to cancelation of my admission.",
    signatureLabel: lng === "bn" ? "আবেদনকারী / অভিভাবকের ডিজিটাল স্বাক্ষর (পূর্ণ নাম লিখুন)" : "Digital Signature of Applicant / Guardian (Type Full Name)",

    btnNext: lng === "bn" ? "পরবর্তী ধাপ" : "Next Step",
    btnPrev: lng === "bn" ? "পূর্ববর্তী ধাপ" : "Previous Step",
    btnSubmit: lng === "bn" ? "আবেদন দাখিল করুন" : "Submit Application",
    
    successTitle: lng === "bn" ? "ভর্তি আবেদন সফলভাবে সম্পন্ন হয়েছে!" : "Admission Application Submitted Successfully!",
    successDesc: lng === "bn" ? "আপনার আবেদনটি গৃহীত হয়েছে। নিচে আপনার ভর্তি স্লিপ দেওয়া হলো। দয়া করে স্লিপটি সংরক্ষণ করুন।" : "Your application has been received. Below is your admission registration slip. Please save or print it.",
    slipHeader: lng === "bn" ? "ভর্তি আবেদন রশিদ" : "Admission Application Slip",
    applicationIdLabel: lng === "bn" ? "আবেদন নম্বর (Application ID)" : "Application ID",
    appliedDateLabel: lng === "bn" ? "আবেদনের তারিখ" : "Application Date",
    btnPrint: lng === "bn" ? "রশিদ প্রিন্ট করুন" : "Print Receipt",
    btnDownload: lng === "bn" ? "পিডিএফ ডাউনলোড" : "Download PDF"
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.studentNameEn) newErrors.studentNameEn = lng === "bn" ? "শিক্ষার্থীর নাম ইংরেজিতে আবশ্যক" : "Student Name in English is required";
      if (!formData.studentNameBn) newErrors.studentNameBn = lng === "bn" ? "শিক্ষার্থীর নাম বাংলায় আবশ্যক" : "Student Name in Bengali is required";
      if (!formData.dob) newErrors.dob = lng === "bn" ? "জন্ম তারিখ আবশ্যক" : "Date of Birth is required";
    } else if (step === 2) {
      if (!formData.appliedClass) newErrors.appliedClass = lng === "bn" ? "শ্রেণী নির্বাচন করুন" : "Select a class";
      if (!formData.session) newErrors.session = lng === "bn" ? "সেশন নির্বাচন করুন" : "Select a session";
    } else if (step === 3) {
      if (!formData.fatherName) newErrors.fatherName = lng === "bn" ? "পিতার নাম আবশ্যক" : "Father's Name is required";
      if (!formData.fatherPhone) newErrors.fatherPhone = lng === "bn" ? "পিতার মোবাইল নম্বর আবশ্যক" : "Father's Phone Number is required";
      if (!formData.motherName) newErrors.motherName = lng === "bn" ? "মাতার নাম আবশ্যক" : "Mother's Name is required";
      if (!formData.mobile) newErrors.mobile = lng === "bn" ? "আবেদনকারীর প্রধান মোবাইল নম্বর আবশ্যক" : "Primary mobile number is required";
      if (!formData.presentAddress) newErrors.presentAddress = lng === "bn" ? "বর্তমান ঠিকানা আবশ্যক" : "Present address is required";
    } else if (step === 4) {
      if (!formData.declaration) newErrors.declaration = lng === "bn" ? "অঙ্গীকারনামা টিক দিন" : "Declaration consent is required";
      if (!formData.signatureName) newErrors.signatureName = lng === "bn" ? "ডিজিটাল স্বাক্ষর আবশ্যক" : "Digital signature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error(lng === "bn" ? "দয়া করে প্রয়োজনীয় সব ক্ষেত্র সঠিক তথ্য দিয়ে পূরণ করুন।" : "Please fill in all the required fields correctly.");
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      toast.error(lng === "bn" ? "অনুরোধটি সম্পন্ন করার আগে ত্রুটিগুলি সংশোধন করুন।" : "Please fix errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      const randomId = "EPA-" + Math.floor(100000 + Math.random() * 900000);
      setRegistrationSlip({
        applicationId: randomId,
        date: new Date().toLocaleDateString(lng === "bn" ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        studentName: formData.studentNameEn,
        appliedClass: formData.appliedClass,
        session: formData.session,
        mobile: formData.mobile
      });
      setStep(5);
      toast.success(lng === "bn" ? "আবেদনটি সফলভাবে জমা দেওয়া হয়েছে!" : "Application submitted successfully!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printAreaRef.current) {
      const printContents = printAreaRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      // Open print friendly window
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Online Admission Receipt - ${formData.studentNameEn}</title>
              <style>
                body { font-family: 'Noto Sans', 'Noto Sans Bengali', sans-serif; padding: 40px; color: #333; }
                .receipt-container { border: 2px solid #00B16A; border-radius: 12px; padding: 30px; max-width: 700px; margin: 0 auto; }
                .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { color: #00B16A; margin: 0; font-size: 28px; }
                .header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
                .grid-item { font-size: 15px; }
                .grid-item strong { color: #555; }
                .footer { text-align: center; border-top: 1px dashed #ccc; padding-top: 20px; font-size: 12px; color: #888; }
                .seal { float: right; border: 1px solid #ddd; width: 100px; height: 100px; text-align: center; line-height: 100px; color: #ccc; }
              </style>
            </head>
            <body>
              <div class="receipt-container">
                <div class="seal">OFFICE SEAL</div>
                ${printContents}
                <div class="footer">This is an auto-generated slip. Please present it at the school admission counter.</div>
              </div>
              <script>
                window.onload = function() { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  // Helper classes for input validation errors
  const inputErrorStyle = (fieldName: string) => {
    return errors[fieldName] ? "border-red-500 focus-visible:ring-red-400" : "border-gray-200 focus-visible:ring-primary/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-emerald-50/20 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Stepper Banner */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary to-[#02965a] p-8 text-white relative">
            {/* Absolute decorative items */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-white/5 rounded-full -mb-12 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-2 font-sans">{strings.title}</h1>
                <p className="text-white/80 text-sm max-w-xl">{strings.subtitle}</p>
              </div>
              {step <= 4 && (
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl shrink-0 text-center border border-white/10">
                  <span className="text-xs uppercase font-bold tracking-widest text-white/90">Step</span>
                  <p className="text-3xl font-black">{step} <span className="text-sm font-medium opacity-75">/ 4</span></p>
                </div>
              )}
            </div>
          </div>

          {/* Stepper Steps UI */}
          {step <= 4 && (
            <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {[
                  { stepNum: 1, label: strings.step1 },
                  { stepNum: 2, label: strings.step2 },
                  { stepNum: 3, label: strings.step3 },
                  { stepNum: 4, label: strings.step4 }
                ].map((s, index) => (
                  <React.Fragment key={s.stepNum}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        step === s.stepNum 
                          ? 'bg-primary text-white ring-4 ring-primary/20 scale-110' 
                          : step > s.stepNum 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white border border-gray-200 text-gray-400'
                      }`}>
                        {step > s.stepNum ? <Check className="w-5 h-5" /> : s.stepNum}
                      </div>
                      <span className={`text-sm font-semibold transition-colors duration-300 ${
                        step === s.stepNum ? 'text-primary' : step > s.stepNum ? 'text-gray-700' : 'text-gray-400'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`hidden sm:block h-[2px] flex-1 mx-2 transition-colors duration-500 ${
                        step > s.stepNum ? 'bg-emerald-400' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 transition-all">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: STUDENT PERSONAL DETAILS */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" /> {strings.personalHeader}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Student Name EN */}
                  <div className="space-y-2">
                    <Label htmlFor="studentNameEn" className="text-gray-700 font-semibold flex items-center gap-1">
                      {strings.studentNameEnLabel} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="studentNameEn"
                      name="studentNameEn"
                      value={formData.studentNameEn}
                      onChange={handleInputChange}
                      placeholder="e.g. TASNIM ALAM"
                      className={`h-11 ${inputErrorStyle("studentNameEn")}`}
                    />
                    {errors.studentNameEn && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.studentNameEn}</p>
                    )}
                  </div>

                  {/* Student Name BN */}
                  <div className="space-y-2">
                    <Label htmlFor="studentNameBn" className="text-gray-700 font-semibold flex items-center gap-1">
                      {strings.studentNameBnLabel} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="studentNameBn"
                      name="studentNameBn"
                      value={formData.studentNameBn}
                      onChange={handleInputChange}
                      placeholder="যেমন: তাসনিম আলম"
                      className={`h-11 ${inputErrorStyle("studentNameBn")}`}
                    />
                    {errors.studentNameBn && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.studentNameBn}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  {/* DOB */}
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-gray-700 font-semibold flex items-center gap-1">
                      {strings.dobLabel} <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className={`h-11 pr-10 ${inputErrorStyle("dob")}`}
                      />
                    </div>
                    {errors.dob && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.dob}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-700 font-semibold">{strings.genderLabel}</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full h-11 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Male">{lng === "bn" ? "পুরুষ" : "Male"}</option>
                      <option value="Female">{lng === "bn" ? "নারী" : "Female"}</option>
                      <option value="Other">{lng === "bn" ? "অন্যান্য" : "Other"}</option>
                    </select>
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-gray-700 font-semibold">{strings.bloodGroupLabel}</Label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full h-11 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  {/* Religion */}
                  <div className="space-y-2">
                    <Label htmlFor="religion" className="text-gray-700 font-semibold">{strings.religionLabel}</Label>
                    <select
                      id="religion"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full h-11 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Islam">{lng === "bn" ? "ইসলাম" : "Islam"}</option>
                      <option value="Hinduism">{lng === "bn" ? "সনাতন / হিন্দু" : "Hinduism"}</option>
                      <option value="Buddhism">{lng === "bn" ? "বৌদ্ধ" : "Buddhism"}</option>
                      <option value="Christianity">{lng === "bn" ? "খ্রিস্টান" : "Christianity"}</option>
                      <option value="Others">{lng === "bn" ? "অন্যান্য" : "Others"}</option>
                    </select>
                  </div>

                  {/* Nationality */}
                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="text-gray-700 font-semibold">{strings.nationalityLabel}</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">{strings.photoLabel}</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-dashed border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                        {photoPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <UploadCloud className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="file"
                          id="studentPhoto"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, 'photo')}
                          className="hidden"
                        />
                        <label
                          htmlFor="studentPhoto"
                          className="flex items-center justify-center gap-1.5 h-11 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer transition-colors bg-white px-2 text-center"
                        >
                          <UploadCloud className="w-4 h-4 text-gray-500" /> {lng === "bn" ? "ছবি নির্বাচন করুন" : "Choose Image"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ACADEMIC DETAILS */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" /> {strings.academicHeader}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  {/* Applied Class */}
                  <div className="space-y-2">
                    <Label htmlFor="appliedClass" className="text-gray-700 font-semibold flex items-center gap-1">
                      {strings.appliedClassLabel} <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="appliedClass"
                      name="appliedClass"
                      value={formData.appliedClass}
                      onChange={handleInputChange}
                      className={`w-full h-11 bg-white border rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${inputErrorStyle("appliedClass")}`}
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Session */}
                  <div className="space-y-2">
                    <Label htmlFor="session" className="text-gray-700 font-semibold flex items-center gap-1">
                      {strings.sessionLabel} <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="session"
                      name="session"
                      value={formData.session}
                      onChange={handleInputChange}
                      className={`w-full h-11 bg-white border rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${inputErrorStyle("session")}`}
                    >
                      {sessions.filter(s => s.status === "Active").map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Medium */}
                  <div className="space-y-2">
                    <Label htmlFor="medium" className="text-gray-700 font-semibold">{strings.mediumLabel}</Label>
                    <select
                      id="medium"
                      name="medium"
                      value={formData.medium}
                      onChange={handleInputChange}
                      className="w-full h-11 bg-white border border-gray-200 rounded-lg px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Bangla">{lng === "bn" ? "বাংলা মাধ্যম" : "Bangla Medium"}</option>
                      <option value="English">{lng === "bn" ? "ইংরেজি ভার্সন" : "English Version"}</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 pt-2">
                  {/* Previous School */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="prevSchool" className="text-gray-700 font-semibold">{strings.prevSchoolLabel}</Label>
                    <Input
                      id="prevSchool"
                      name="prevSchool"
                      value={formData.prevSchool}
                      onChange={handleInputChange}
                      placeholder="e.g. Model School & College"
                      className="h-11"
                    />
                  </div>

                  {/* Previous Class */}
                  <div className="space-y-2">
                    <Label htmlFor="prevClass" className="text-gray-700 font-semibold">{strings.prevClassLabel}</Label>
                    <Input
                      id="prevClass"
                      name="prevClass"
                      value={formData.prevClass}
                      onChange={handleInputChange}
                      placeholder="Class 5"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Previous GPA */}
                  <div className="space-y-2">
                    <Label htmlFor="prevGpa" className="text-gray-700 font-semibold">{strings.prevGpaLabel}</Label>
                    <Input
                      id="prevGpa"
                      name="prevGpa"
                      value={formData.prevGpa}
                      onChange={handleInputChange}
                      placeholder="5.00 / 02"
                      className="h-11"
                    />
                  </div>

                  {/* Birth Certificate Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">{strings.birthCertLabel}</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-dashed border-gray-300 overflow-hidden flex items-center justify-center shrink-0">
                        {birthCertPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={birthCertPreview} alt="Certificate Preview" className="w-full h-full object-cover" />
                        ) : (
                          <UploadCloud className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="file"
                          id="birthCert"
                          accept="image/*,application/pdf"
                          onChange={(e) => handlePhotoUpload(e, 'birthCert')}
                          className="hidden"
                        />
                        <label
                          htmlFor="birthCert"
                          className="flex items-center justify-center gap-1.5 h-11 border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer transition-colors bg-white px-2 text-center"
                        >
                          <UploadCloud className="w-4 h-4 text-gray-500" /> {lng === "bn" ? "ফাইল নির্বাচন করুন" : "Choose File"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PARENTS, GUARDIAN & CONTACT DETAILS */}
            {step === 3 && (
              <div className="space-y-8">
                
                {/* Parents Details */}
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-6 h-6 text-primary" /> {strings.guardianHeader}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Father Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fatherName" className="text-gray-700 font-semibold flex items-center gap-1">
                        {strings.fatherNameLabel} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fatherName"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        placeholder="Father's Full Name"
                        className={`h-11 ${inputErrorStyle("fatherName")}`}
                      />
                      {errors.fatherName && (
                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fatherName}</p>
                      )}
                    </div>

                    {/* Father Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="fatherPhone" className="text-gray-700 font-semibold flex items-center gap-1">
                        {strings.fatherPhoneLabel} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fatherPhone"
                        name="fatherPhone"
                        value={formData.fatherPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. 01712xxxxxx"
                        className={`h-11 ${inputErrorStyle("fatherPhone")}`}
                      />
                      {errors.fatherPhone && (
                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fatherPhone}</p>
                      )}
                    </div>

                    {/* Father Occupation */}
                    <div className="space-y-2">
                      <Label htmlFor="fatherOccupation" className="text-gray-700 font-semibold">{strings.fatherOccupationLabel}</Label>
                      <Input
                        id="fatherOccupation"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleInputChange}
                        placeholder="e.g. Business / Service"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Mother Name */}
                    <div className="space-y-2">
                      <Label htmlFor="motherName" className="text-gray-700 font-semibold flex items-center gap-1">
                        {strings.motherNameLabel} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="motherName"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        placeholder="Mother's Full Name"
                        className={`h-11 ${inputErrorStyle("motherName")}`}
                      />
                      {errors.motherName && (
                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.motherName}</p>
                      )}
                    </div>

                    {/* Mother Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="motherPhone" className="text-gray-700 font-semibold">{strings.motherPhoneLabel}</Label>
                      <Input
                        id="motherPhone"
                        name="motherPhone"
                        value={formData.motherPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. 01712xxxxxx"
                        className="h-11"
                      />
                    </div>

                    {/* Mother Occupation */}
                    <div className="space-y-2">
                      <Label htmlFor="motherOccupation" className="text-gray-700 font-semibold">{strings.motherOccupationLabel}</Label>
                      <Input
                        id="motherOccupation"
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleInputChange}
                        placeholder="e.g. Housewife"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Alternative Guardian */}
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-6 h-6 text-primary animate-pulse" /> {strings.guardianSubHeader}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Guardian Name */}
                    <div className="space-y-2">
                      <Label htmlFor="guardianName" className="text-gray-700 font-semibold">{strings.guardianNameLabel}</Label>
                      <Input
                        id="guardianName"
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleInputChange}
                        placeholder="Guardian Full Name"
                        className="h-11"
                      />
                    </div>

                    {/* Guardian Relation */}
                    <div className="space-y-2">
                      <Label htmlFor="guardianRelation" className="text-gray-700 font-semibold">{strings.guardianRelationLabel}</Label>
                      <Input
                        id="guardianRelation"
                        name="guardianRelation"
                        value={formData.guardianRelation}
                        onChange={handleInputChange}
                        placeholder="e.g. Uncle / Brother"
                        className="h-11"
                      />
                    </div>

                    {/* Guardian Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="guardianPhone" className="text-gray-700 font-semibold">{strings.guardianPhoneLabel}</Label>
                      <Input
                        id="guardianPhone"
                        name="guardianPhone"
                        value={formData.guardianPhone}
                        onChange={handleInputChange}
                        placeholder="e.g. 01712xxxxxx"
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Address and Core Contact */}
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-primary" /> {strings.contactHeader}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Primary Mobile */}
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-gray-700 font-semibold flex items-center gap-1">
                        {strings.mobileLabel} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="e.g. 01712000000"
                        className={`h-11 ${inputErrorStyle("mobile")}`}
                      />
                      {errors.mobile && (
                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.mobile}</p>
                      )}
                    </div>

                    {/* Primary Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-semibold">{strings.emailLabel}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. applicant@gmail.com"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Present Address */}
                    <div className="space-y-2">
                      <Label htmlFor="presentAddress" className="text-gray-700 font-semibold flex items-center gap-1">
                        {strings.presentAddressLabel} <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        id="presentAddress"
                        name="presentAddress"
                        rows={3}
                        value={formData.presentAddress}
                        onChange={handleInputChange}
                        placeholder="Village/Road, Post Office, Upazila, District"
                        className={`w-full bg-white border rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${inputErrorStyle("presentAddress")}`}
                      />
                      {errors.presentAddress && (
                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.presentAddress}</p>
                      )}
                    </div>

                    {/* Permanent Address */}
                    <div className="space-y-2">
                      <Label htmlFor="permanentAddress" className="text-gray-700 font-semibold">{strings.permanentAddressLabel}</Label>
                      <textarea
                        id="permanentAddress"
                        name="permanentAddress"
                        rows={3}
                        value={formData.permanentAddress}
                        onChange={handleInputChange}
                        placeholder="Village/Road, Post Office, Upazila, District"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & DECLARATION SUBMISSION */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" /> {strings.reviewHeader}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{strings.reviewSubtitle}</p>
                </div>

                {/* Review Data Summary Grid */}
                <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 space-y-6 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-xs">{strings.step1}</h3>
                      <p><strong>Name (EN):</strong> {formData.studentNameEn}</p>
                      <p><strong>Name (BN):</strong> {formData.studentNameBn}</p>
                      <p><strong>DOB:</strong> {formData.dob}</p>
                      <p><strong>Gender:</strong> {formData.gender}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-xs">{strings.step2}</h3>
                      <p><strong>Class:</strong> {formData.appliedClass}</p>
                      <p><strong>Session:</strong> {formData.session}</p>
                      <p><strong>Medium:</strong> {formData.medium}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-xs">{strings.step3}</h3>
                      <p><strong>Father:</strong> {formData.fatherName} ({formData.fatherPhone})</p>
                      <p><strong>Mother:</strong> {formData.motherName}</p>
                      <p><strong>Primary Contact:</strong> {formData.mobile}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-2 uppercase tracking-wide text-xs">Address</h3>
                      <p className="line-clamp-2"><strong>Present:</strong> {formData.presentAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Declaration Box */}
                <div className="border border-primary/20 bg-primary/5 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="declaration"
                      name="declaration"
                      checked={formData.declaration}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30 border-gray-300"
                    />
                    <label htmlFor="declaration" className="text-sm font-semibold text-gray-700 leading-snug cursor-pointer select-none">
                      {strings.declarationText}
                    </label>
                  </div>
                  {errors.declaration && (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.declaration}</p>
                  )}

                  {/* Digital Signature */}
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="signatureName" className="text-gray-700 font-semibold">
                      {strings.signatureLabel} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="signatureName"
                      name="signatureName"
                      value={formData.signatureName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className={`h-11 bg-white font-mono ${inputErrorStyle("signatureName")}`}
                    />
                    {errors.signatureName && (
                      <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.signatureName}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS & SLIP GENERATOR */}
            {step === 5 && registrationSlip && (
              <div className="space-y-8">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{strings.successTitle}</h2>
                  <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">{strings.successDesc}</p>
                </div>

                {/* Registration Slip Render Container */}
                <div 
                  ref={printAreaRef}
                  className="bg-white border-2 border-primary rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
                >
                  {/* Decorative background watermark */}
                  <div className="absolute right-0 bottom-0 text-gray-100 font-black text-7xl select-none pointer-events-none transform translate-x-5 translate-y-5">
                    ePathshala
                  </div>

                  <div className="text-center border-b border-gray-100 pb-4 mb-6">
                    <h3 className="text-xl font-bold text-primary">{strings.slipHeader}</h3>
                    <p className="text-xs text-gray-400">ePathshala School Management Platform</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                    <div>
                      <p className="mb-2"><strong>{strings.applicationIdLabel}:</strong> <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{registrationSlip.applicationId}</span></p>
                      <p className="mb-2"><strong>{strings.appliedDateLabel}:</strong> {registrationSlip.date}</p>
                      <p className="mb-2"><strong>{strings.studentNameEnLabel}:</strong> {registrationSlip.studentName}</p>
                    </div>
                    <div>
                      <p className="mb-2"><strong>{strings.appliedClassLabel}:</strong> {registrationSlip.appliedClass}</p>
                      <p className="mb-2"><strong>{strings.sessionLabel}:</strong> {registrationSlip.session}</p>
                      <p className="mb-2"><strong>{strings.mobileLabel}:</strong> {registrationSlip.mobile}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 leading-relaxed border border-gray-100">
                    <p className="font-bold text-gray-700 mb-1">Instruction / নির্দেশনা:</p>
                    <p>1. Please print this slip or save it as PDF. (অনগ্রহ করে এই রশিদটি প্রিন্ট করুন অথবা পিডিএফ ফাইল হিসেবে সংরক্ষণ করুন।)</p>
                    <p className="mt-1">2. Show this Application ID at the school admission counter to complete the payment and validation steps. (ভর্তি প্রক্রিয়া এবং পেমেন্ট সম্পন্ন করতে স্কুলের এডমিশন কাউন্টারে এই আইডিটি প্রদর্শন করুন।)</p>
                  </div>
                </div>

                {/* Print & Download buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Button 
                    type="button"
                    onClick={handlePrint}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white flex items-center gap-2 h-11 px-6 rounded-xl font-semibold"
                  >
                    <Printer className="w-4 h-4" /> {strings.btnPrint}
                  </Button>
                  <Button 
                    type="button"
                    onClick={handlePrint}
                    variant="outline"
                    className="w-full sm:w-auto flex items-center gap-2 h-11 px-6 rounded-xl font-semibold"
                  >
                    <Download className="w-4 h-4" /> {strings.btnDownload}
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setPhotoPreview(null);
                      setBirthCertPreview(null);
                      setRegistrationSlip(null);
                    }}
                    variant="ghost"
                    className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold"
                  >
                    {lng === "bn" ? "আরেকটি আবেদন করুন" : "Submit Another Application"}
                  </Button>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            {step <= 4 && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                      className="flex items-center gap-1.5 h-11 rounded-xl px-5 border-gray-200"
                    >
                      <ArrowLeft className="w-4 h-4" /> {strings.btnPrev}
                    </Button>
                  )}
                </div>
                <div>
                  {step < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 h-11 rounded-xl px-5 font-semibold"
                    >
                      {strings.btnNext} <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/95 text-white flex items-center gap-2 h-11 rounded-xl px-6 font-bold"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {lng === "bn" ? "জমা দেওয়া হচ্ছে..." : "Submitting..."}
                        </span>
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> {strings.btnSubmit}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

          </form>
        </div>

      </div>
    </div>
  );
}
