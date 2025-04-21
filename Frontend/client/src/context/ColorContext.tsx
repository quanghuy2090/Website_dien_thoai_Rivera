import { createContext } from "react";
import { addColors, Color, deleteColors, getColors, getColorsById, getDeleteColor, RestoreColor, updateColors } from "../services/color";
import ColorReducer from "../reducers/ColorReducer";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


type ColorContextType = {
  state: { colors: Color[]; selectedColor?: Color, deletedColor: Color[] };
  createColor: (color: Color) => void;
  removeColor: (_id: string) => void;
  updateColor: (_id: string, color: Color) => void;
  getDetailColor: (_id: string) => void;
  updateColorRestored: (_id: string, color: Color) => void;
};

export const ColorContext = createContext({} as ColorContextType);

type Children = {
  children: React.ReactNode;
};

export const ColorProvider = ({ children }: Children) => {
  const [state, dispatch] = useReducer(ColorReducer, { colors: [], deletedColor: [] });
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await getColors();
      dispatch({ type: "GET_COLORS", payload: data.data });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await getDeleteColor();
      dispatch({ type: "GET_COLOR_DELETE", payload: data.data });
    })()
  }, [])

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
        const response = await deleteColors(_id);
        console.log(response);
        dispatch({ type: "REMOVE_COLORS", payload: _id });

        const { data } = await getDeleteColor();
        dispatch({ type: "GET_COLOR_DELETE", payload: data.data })
        toast.success("  Xóa màu thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể xóa màu này vì nó đang được sử dụng trong sản phẩm");
    }
  };
  const updateColor = async (_id: string, color: Color) => {
    try {
      const { data } = await updateColors(_id, color)
      dispatch({ type: "UPDATE_COLORS", payload: data.data })
      nav("/admin/color");
      toast.success("Sửa màu thành công")
    } catch (error) {
      console.log(error);
      toast.error("Sửa màu thất bại")
    }
  }
  const getDetailColor = async (_id: string) => {
    try {
      const { data } = await getColorsById(_id);
      dispatch({ type: "SET_SELECTED_COLOR", payload: data.data })
    } catch (error) {
      console.log(error)
    }
  }
  const updateColorRestored = async (_id: string, color: Color) => {
    try {
      await RestoreColor(_id, color);

      dispatch({
        type: "UPDATE_COLOR_RESTORE",
        payload: color,
      });
      const { data } = await getColors();
      dispatch({ type: "GET_COLORS", payload: data.data });
      toast.success("Khôi phục màu thành công");

    } catch (error) {
      console.log(error);
      toast.error("Khôi phục màu thất bại");
    }
  };
  return (
    <ColorContext.Provider value={{ state, createColor, removeColor, updateColor, getDetailColor, updateColorRestored }}>
      {children}
    </ColorContext.Provider>
  );
};
