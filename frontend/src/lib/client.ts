import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

export class Client {
  private axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.axios = axios.create({ baseURL: baseUrl, withCredentials: true });
  }

  public async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.axios.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("POST request error response:", error.response?.data);
        throw new Error(
          error.response?.data?.errors ||
            error.response?.data?.message ||
            "An error occurred during the POST request",
        );
      }
      throw error;
    }
  }

  public async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.axios.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("GET request error response:", error.response?.data);
        throw new Error(
          error.response?.data?.errors ||
            error.response?.data?.message ||
            "An error occurred during the GET request",
        );
      }
      throw error;
    }
  }
}

export const apiClient = new Client(
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
);
