import { http } from "../config/axios";

export type Color = {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}

export const getColors = () => {
    return http.get("/color")
}

export const addColors = (color: Color) => {
    return http.post("/color", color)
}

export const deleteColors = (_id: string) => {
    return http.delete("/color/" + _id)
}

export const getColorsById = (_id: string) => {
    return http.get(`/color/${_id}`)
}

export const updateColors = (_id: string, color: Color) => {
    return http.put(`/color/${_id}`, color)
}

export const getDeleteColor = () => {
    return http.get("/color/deleted");
}

export const RestoreColor = (_id: string, color: Color) => {
    return http.patch(`/color/restore/${_id}`, color);
}