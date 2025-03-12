import React, { useEffect, useState } from "react";
import { Carts, deleteCart, getCart, updateCart } from "../../services/cart";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Cart = () => {
  const [carts, setCarts] = useState<Carts[]>(() => []);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null); // Lưu userId vào state

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          setUserId(user._id); // Lưu userId vào state
          fetchCart(user._id);
        }
      } catch (error) {
        console.error(" Lỗi khi parse user data:", error);
      }
    }
  }, []);

  const fetchCart = async (userId: string) => {
    try {
      console.log(" Fetching cart for user ID:", userId);
      const { data } = await getCart(userId);
      console.log("Dữ liệu giỏ hàng:", data);
      setCarts(data.cart.items || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (error) {
      console.error(" Lỗi khi lấy giỏ hàng:", error);
    }
  };

  const removeCart = async (productId: string) => {
    if (!userId || !productId) {
      console.error(" userId hoặc productId bị thiếu:", { userId, productId });
      return;
    }
    try {
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm?");
      if (isConfirmed) {
        // Lọc ra các sản phẩm còn lại sau khi xóa
        const updatedCarts = carts.filter(
          (cart) => cart.productId._id !== productId
        );
        setCarts(updatedCarts);

        // Tính lại tổng tiền
        const newTotalAmount = updatedCarts.reduce(
          (sum, item) => sum + item.productId.price * item.quantity,
          0
        );
        setTotalAmount(newTotalAmount);

        // Gửi request xóa sản phẩm khỏi backend
        await deleteCart(userId, productId);
        toast.success("Cart deleted successfully");
        console.log(
          " Sản phẩm đã được xóa, tổng tiền cập nhật:",
          newTotalAmount
        );
      }
    } catch (error) {
      console.error(" Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      toast.error("Error");
    }
  };

  const handleUpdateCart = async (productId: string, change: number) => {
    const updatedCart = carts.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );

    setCarts(updatedCart);

    const newTotalAmount = updatedCart.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );
    setTotalAmount(newTotalAmount);

    try {
      // Gửi request update lên backend
      const quantity =
        updatedCart.find((item) => item.productId?._id === productId)
          ?.quantity ?? 1;
      const newCartData = await updateCart(
        String(userId),
        productId,
        Number(quantity)
      );
      toast.success("Updated quantity cart successfully");
      if (newCartData.data && Array.isArray(newCartData.data.data)) {
        setCarts(newCartData.data.cart); // Cập nhật lại state với dữ liệu từ server
      }
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng", error);
      toast.error("Error");
    }
  };

  const formatPrice = (price: number) => {
    if (price === undefined || price === null) {
      return "0 VND"; // Return a default value if price is undefined
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " VND";
  };

  return (
    <div>
      {/* Page Header Start */}
      <div className="container-fluid bg-secondary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: 150 }}
        >
          <h1 className="font-weight-semi-bold text-uppercase mb-3">
            Giỏ hàng
          </h1>
          <div className="d-inline-flex">
            <p className="m-0">
              <a href="/">Trang chủ</a>
            </p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Giỏ hàng</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}
      {/* Cart Start */}
      <div className="container-fluid pt-5">
  <div className="row px-xl-5">
    <div className="col-lg-8 table-responsive mb-5">
      <table className="table table-striped table-hover table-bordered text-center align-middle">
        <thead style={{ backgroundColor: "#357ABD", color: "white" }}>
          <tr>
            <th scope="col">Sản phẩm</th>
            <th scope="col">Giá bán</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Thành tiền</th>
            <th scope="col">Hủy</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((item) => (
            <tr key={item.productId._id}>
              <td className="align-middle">
                {item.productId?.images && (
                  <div className="d-flex align-items-center">
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId?.name || "Sản phẩm"}
                      width={100}
                      height={70}
                      className="me-2 rounded border"
                    />
                    <Link
                      className="text-decoration-none text-dark fw-medium"
                      to={`/product/${item.productId._id}`}
                    >
                      {item.productId?.name}
                    </Link>
                  </div>
                )}
              </td>

              <td className="align-middle">{formatPrice(item.productId?.price)}</td>

              <td className="align-middle">
                <div className="d-flex align-items-center justify-content-between mx-auto" style={{ width: 120 }}>
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "#357ABD", color: "white" }}
                    onClick={() => handleUpdateCart(item.productId._id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <i className="fa fa-minus" />
                  </button>

                  <input
                    type="text"
                    className="form-control form-control-sm text-center border-dark mx-2"
                    value={item.quantity}
                    readOnly
                    style={{ width: 40 }}
                  />

                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "#357ABD", color: "white" }}
                    onClick={() => handleUpdateCart(item.productId._id, 1)}
                  >
                    <i className="fa fa-plus" />
                  </button>
                </div>
              </td>

              <td className="align-middle">{formatPrice(item.productId.price * item.quantity)}</td>

              <td className="align-middle">
                <button
                  className="btn btn-sm"
                  style={{ backgroundColor: "#357ABD", color: "white" }}
                  onClick={() => removeCart(item.productId._id)}
                >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Tổng quan */}
    <div className="col-lg-4">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header text-white text-center" style={{ backgroundColor: "#357ABD" }}>
          <h5 className="fw-bold m-0">Tổng quan</h5>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h6 className="fw-medium text-dark">Tổng tiền hàng</h6>
            <h6 className="fw-medium text-dark">{formatPrice(totalAmount)}</h6>
          </div>
          <div className="d-flex justify-content-between">
            <h6 className="fw-medium text-dark">Phí vận chuyển</h6>
            <h6 className="fw-medium text-dark">Miễn phí</h6>
          </div>
        </div>

        <div className="card-footer bg-light border-0">
          <div className="d-flex justify-content-between">
            <h5 className="text-dark fw-bold">Tổng cộng</h5>
            <h5 className="text-dark fw-bold">{formatPrice(totalAmount)}</h5>
          </div>
          <Link to="/checkout" className="btn w-100 mt-3 py-3 fw-bold text-white" style={{ backgroundColor: "#357ABD" }}>
            Thanh Toán
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>



      {/* Cart End */}
    </div>
  );
};

export default Cart;
