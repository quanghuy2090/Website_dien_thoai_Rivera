import { createContext } from "react";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addCapacity, Capacity, deleteCapacity, getCapacity } from "../services/capacity";
import CapacityReducer from "../reducers/CapacityReducer";

type CapacityContextType = {
    states: { capacitys: Capacity[]; };
    createCapacity: (capacity: Capacity) => void;
    removeCapacity: (_id: string) => void;
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
    return (
        <CapacityContext.Provider value={{ states, createCapacity, removeCapacity }}>
            {children}
        </CapacityContext.Provider>
    );
};
