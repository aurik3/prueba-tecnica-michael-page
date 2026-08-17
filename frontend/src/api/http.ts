import axios, { AxiosError } from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"
});

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? "No se pudo completar la petición";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo completar la petición";
};
