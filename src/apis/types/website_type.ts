export interface TWebsiteNotice {
    id: string;
    title: string;
    content: string;
    attachmentUrl?: string;
    publishedAt?: string;
    isActive: boolean;
    createdAt: string;
}

export interface TWebsiteGallery {
    id: string;
    title: string;
    category: "Academic" | "Sports" | "Events" | "Campus" | "Other";
    imageUrl: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
}

export interface TWebsiteContent {
    id: string;
    page: string;
    section: string;
    content: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}
