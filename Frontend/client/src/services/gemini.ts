import { http } from "../config/axios";

export const getProductExplanation = (productId: string, consultQuery?: string) => {
    console.log("Sending request to:", `/gemini/explain/${productId}`, { consultQuery });
    return http.post(`/gemini/explain/${productId}`, { consultQuery });
};