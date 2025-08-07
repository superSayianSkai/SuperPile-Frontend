import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios";

const getMetaData = async ({ link }) => {
  const encodedUrl = encodeURIComponent(link);
  try {
    console.log(encodedUrl);
    const { data } = await apiClient.get(`/metaScrapper?url=${encodedUrl}`);
    const metaInfo = {
      image: data?.data.image,
      title: data?.data.title,
      description: data?.data.description,
      url: link,
    };

    console.log(metaInfo);
    return metaInfo;
  } catch (error) {
    console.log(error);
    return new Error("couldn't fetch metaData");
  }
};

const useMeta = ({ link }) => {
  console.log(link);
  return useQuery({
    queryKey: ["metaData", link],
    enabled: !!link,
    queryFn: () => getMetaData({ link }),
    retry: (failureCount, error) => {
      // Only retry on network errors or if the status is not 401
      if (error.status === 401) return false; // Don't retry on 401
      return failureCount < 3;
    },
    // staleTime: 5000,
  });
};

export default useMeta;