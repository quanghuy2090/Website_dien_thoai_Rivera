import { createContext } from "react";
import { addColors, Color, deleteColors, getColors } from "../services/color";
import ColorReducer from "../reducers/ColorReducer";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type ColorContextType = {
  state: { colors: Color[]; selectedColor?: Color };
  createColor: (color: Color) => void;
  removeColor: (_id: string) => void;
};

export const ColorContext = createContext({} as ColorContextType);

type Children = {
  children: React.ReactNode;
};

export const ColorProvider = ({ children }: Children) => {
  const [state, dispatch] = useReducer(ColorReducer, { colors: [] });
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await getColors();
      dispatch({ type: "GET_COLORS", payload: data.data });
    })();
  }, []);

  const createColor = async (color: Color) => {
    try {
      const { data } = await addColors(color);
      dispatch({ type: "ADD_COLORS", payload: data.data });
      nav("/admin/color");
      toast.success("Thêm màu thành công");
    } catch (error) {
      console.log(error);
      toast.error("Thêm màu thất bại");
    }
  };

  const removeColor = async (_id: string) => {
    try {
      if (confirm("delete")) {
        await deleteColors(_id);
        dispatch({ type: "REMOVE_COLORS", payload: _id });
        toast.success("  Xóa màu thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error("Xóa màu thất bại");
    }
  };
  return (
    <ColorContext.Provider value={{ state, createColor, removeColor }}>
      {children}
    </ColorContext.Provider>
  );
};
