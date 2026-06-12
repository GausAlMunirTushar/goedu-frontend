import { AxiosAPI } from "@/apis/configs";
import {
  websiteNoticesUrl,
  websiteNoticeDetailUrl,
  websiteGalleriesUrl,
  websiteGalleryDetailUrl,
  websiteContentUrl,
} from "@/apis/endpoints/cms/website_apis";

// Notices
export const createWebsiteNotice = async (payload: any) => {
  const res = await AxiosAPI.post(websiteNoticesUrl, payload);
  return res.data;
};

export const updateWebsiteNotice = async (id: string, payload: any) => {
  const res = await AxiosAPI.put(websiteNoticeDetailUrl(id), payload);
  return res.data;
};

export const deleteWebsiteNotice = async (id: string) => {
  const res = await AxiosAPI.delete(websiteNoticeDetailUrl(id));
  return res.data;
};

// Galleries
export const createWebsiteGallery = async (payload: any) => {
  const res = await AxiosAPI.post(websiteGalleriesUrl, payload);
  return res.data;
};

export const updateWebsiteGallery = async (id: string, payload: any) => {
  const res = await AxiosAPI.put(websiteGalleryDetailUrl(id), payload);
  return res.data;
};

export const deleteWebsiteGallery = async (id: string) => {
  const res = await AxiosAPI.delete(websiteGalleryDetailUrl(id));
  return res.data;
};

// Contents
export const updateWebsiteContent = async (pageName: string, payload: any) => {
  const res = await AxiosAPI.put(websiteContentUrl(pageName), payload);
  return res.data;
};
