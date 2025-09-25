import apiClient from "../lib/axios";

export const getMetaDataSync = async (link) => {
  try {
    const encodedUrl = encodeURIComponent(link);
    const { data } = await apiClient.get(`/api/v1/services/?url=${encodedUrl}`);
    return {
      image: data?.data.image?.trim().replace(/`/g, ''), 
      title: data?.data.title,
      description: data?.data.description,
      url: link,
    };
  } catch (err) {
    console.error("Metadata fetch failed", err);
    return {
      image: "",
      title: "",
      description: "",
      url: link,
    };
  }
};