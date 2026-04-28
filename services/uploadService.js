import API from "@/utils/api";

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  console.log("uploadImage",file);

  return API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};