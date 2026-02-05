import axios, { AxiosError } from "axios";

// Base url for all api calls
const API_BASE_URL = "http://localhost:5000"; 

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* GLOBAL ERROR INTERCEPTOR */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    //  SERVER DOWN / NO RESPONSE
    if (!error.response) {
      (error as any).isServerDown = true;
      (error as any).customMessage =
        "Unable to connect to server. Please check your internet or try again later.";
      return Promise.reject(error);
    }

    const status = error.response.status;

    //  WRONG API / RESOURCE NOT FOUND
    if (status === 404) {
      (error as any).isNotFound = true;
      (error as any).customMessage =
        "Requested data not found. Please try again.";
      return Promise.reject(error);
    }

    // OTHER SERVER ERRORS (500, 400, etc.)
    (error as any).customMessage =
      error.response.data?.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(error);
  }
);


// Reusable API service
export const apiService = { // reusable api wrapper 
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  async patch<T>(url: string, data?: any): Promise<T> {   
    const response = await api.patch<T>(url, data);
    return response.data;
  },

  async delete<T>(url: string): Promise<T> {
    const response = await api.delete<T>(url);
    return response.data;
  },
};
