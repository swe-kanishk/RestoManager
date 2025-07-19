import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, formData) => {
  try {
    const res = await axios.post(`${apiUrl}${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    return error?.response?.data
  }
};

export const postData2 = async (url, formData) => {
  try {
    const res = await axios.post(`${apiUrl}${url}`, formData, {
      headers: {
         "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    return error?.response?.data
  }
};

export const getData = async (url) => {
  try {
    const res = await axios.get(`${apiUrl}${url}`);

    return res.data;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error.response?.data || error.message;
  }
};

export const deleteData = async (url) => {
  try {
    const res = await axios.delete(`${apiUrl}${url}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const editData = async (url, formData) => {
  try {
    const res = await axios.put(`${apiUrl}${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};