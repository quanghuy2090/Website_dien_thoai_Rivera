import { http } from "../config/axios";


export type Capacity = {
    _id: string;
    value: string;
}

export const getCapacity = async () => {
    return http.get("/capacity");
}

export const addCapacity = async (capacity: Capacity) => {
    return http.post("/capacity", capacity)
}
export const deleteCapacity = async (_id: string) => {
    return http.delete("/capacity/" + _id);
}