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
    let message = "Unexpected error occurred";

    if (error.response) {
      message =
        error.response.data?.message ||
        `Server error (${error.response.status})`;
    } else if (error.request) {
      message = "Network error. Please check your connection.";
    }

    // throw normal Error for ErrorBoundary
    return Promise.reject(new Error(message));
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
