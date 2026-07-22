export const API_URL = import.meta.env.VITE_API_URL;

export const IMAGE_URL =
    API_URL.replace("/api", "/images");

export const PROCESSED_IMAGE_URL =
    API_URL.replace("/api", "/processed-images");