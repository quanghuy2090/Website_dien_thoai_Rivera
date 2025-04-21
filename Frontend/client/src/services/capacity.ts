import { http } from "../config/axios";


export type Capacity = {
    _id: string;
    value: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
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
export const getCapacityById = async (_id: string) => {
    return http.get("/capacity/" + _id);
}
export const updateCapacity = async (_id: string, capacity: Capacity) => {
    return http.put("/capacity/" + _id, capacity);
}
export const getDeleteCapacity = async () => {
    return http.get("/capacity/deleted");
}
export const restoreCapacity = async (_id: string, capacity: Capacity) => {
    return http.patch(`/capacity/restore/${_id}`, capacity);
}