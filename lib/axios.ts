import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000";

export const baseAPI = axios.create({
    baseURL: `${API_BASE_URL}/api/manage`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})