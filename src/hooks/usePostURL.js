
import apiClient from "../lib/axios";

const postURL = async (url) => {
  try {
    const response = await apiClient.post("/api/post-pile", { url });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default postURL;
