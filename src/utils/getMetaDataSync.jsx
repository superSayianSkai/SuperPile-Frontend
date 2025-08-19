import apiClient from "../lib/axios";

export const getMetaDataSync = async (link) => {
  try {
    const encodedUrl = encodeURIComponent(link);
    const { data } = await apiClient.get(`/metaScrapper?url=${encodedUrl}`);
    return {
      image: data?.data.image?.trim().replace(/`/g, ''), // Clean the image URL
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