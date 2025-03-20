import { createContext } from "react";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addCapacity, Capacity, deleteCapacity, getCapacity, getCapacityById, updateCapacity } from "../services/capacity";
import CapacityReducer from "../reducers/CapacityReducer";

type CapacityContextType = {
    states: { capacitys: Capacity[]; selectedCapacity?: Capacity };
    createCapacity: (capacity: Capacity) => void;
    removeCapacity: (_id: string) => void;
    updateCapacitys: (_id: string, capacity: Capacity) => void;
    getDetailCapacity: (_id: string) => void;
};
export const CapacityContext = createContext({} as CapacityContextType);

type Children = {
    children: React.ReactNode;
};

export const CapacityProvider = ({ children }: Children) => {
    const [states, dispatch] = useReducer(CapacityReducer, { capacitys: [] });
    const nav = useNavigate();

    useEffect(() => {
        (async () => {
            const { data } = await getCapacity();
            dispatch({ type: "GET_CAPACITY", payload: data.data })

        })();
    }, []);

    const createCapacity = async (capacity: Capacity) => {
        try {
            const { data } = await addCapacity(capacity);
            dispatch({ type: "ADD_CAPACITY", payload: data.data });
            nav("/admin/capacity");
            toast.success("Thêm bộ nhớ thành công");
        } catch (error) {
            console.log(error);
            toast.error("Thêm bộ nhớ thất bại");
        }
    };

    const removeCapacity = async (_id: string) => {
        try {
            if (confirm("delete")) {
                await deleteCapacity(_id);
                dispatch({ type: "REMOVE_CAPACITY", payload: _id });
                toast.success("  Xóa bộ nhớ thành công");
            }
        } catch (error) {
            console.log(error);
            toast.error("Xóa bộ nhớ thất bại");
        }
    };
    const updateCapacitys = async (_id: string, color: Capacity) => {
        try {
            const { data } = await updateCapacity(_id, color)
            dispatch({ type: "UPDATE_CAPACITY", payload: data.data })
            nav("/admin/capacity");
            toast.success("Sửa bộ nhớ thành công")
        } catch (error) {
            console.log(error);
            toast.error("Sửa bộ nhớ thất bại")
        }
    }
    const getDetailCapacity = async (_id: string) => {
        try {
            const { data } = await getCapacityById(_id);
            dispatch({ type: "SET_SELECTED_CAPACITY", payload: data.data })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <CapacityContext.Provider value={{ states, createCapacity, removeCapacity, updateCapacitys, getDetailCapacity }}>
            {children}
        </CapacityContext.Provider>
    );
};
