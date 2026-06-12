import { useQuery } from "@/hooks/useQuery";
import {
  websiteNoticesUrl,
  websiteGalleriesUrl,
  websiteContentUrl,
} from "@/apis/endpoints/cms/website_apis";
import type { TResponse } from "@/types/configs";
import type { TWebsiteNotice, TWebsiteGallery, TWebsiteContent } from "@/apis/types/website_type";

export const useWebsiteNoticesQuery = () => {
  return useQuery<TResponse<TWebsiteNotice[]>>(websiteNoticesUrl);
};

export const useWebsiteGalleriesQuery = () => {
  return useQuery<TResponse<TWebsiteGallery[]>>(websiteGalleriesUrl);
};

export const useWebsiteContentQuery = (pageName: string) => {
  return useQuery<TResponse<TWebsiteContent[]>>(pageName ? websiteContentUrl(pageName) : null);
};
