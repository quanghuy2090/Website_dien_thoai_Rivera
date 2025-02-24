import React, { useEffect, useState } from "react";
import { Carts, deleteCart, getCart, updateCart } from "./../services/cart";
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

  return (
    <div>
      {/* Page Header Start */}
      <div className="container-fluid bg-secondary mb-5">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: 150 }}
        >
          <h1 className="font-weight-semi-bold text-uppercase mb-3">
            Shopping Cart
          </h1>
          <div className="d-inline-flex">
            <p className="m-0">
              <a href="/">Home</a>
            </p>
            <p className="m-0 px-2">-</p>
            <p className="m-0">Shopping Cart</p>
          </div>
        </div>
      </div>
      {/* Page Header End */}
      {/* Cart Start */}
      <div className="container-fluid pt-5">
        <div className="row px-xl-5">
          <div className="col-lg-8 table-responsive mb-5">
            <table className="table table-bordered text-center mb-0">
              <thead className="bg-secondary text-dark">
                <tr>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {carts.map((item) => (
                  <tr>
                    <td className="align-middle">
                      {item.productId?.images && (
                        <img src={item.productId.images[0]} alt="" width={50} />
                      )}
                      {item.productId?.name}
                    </td>
                    <td className="align-middle">{item.productId?.price} VND</td>
                    <td className="align-middle">
                      <div
                        className="input-group quantity mx-auto"
                        style={{ width: 100 }}
                      >
                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-primary btn-minus"
                            onClick={() =>
                              handleUpdateCart(item.productId._id, -1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <i className="fa fa-minus" />
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-secondary text-center"
                          value={item.quantity}
                        />
                        <div className="input-group-btn">
                          <button
                            className="btn btn-sm btn-primary btn-plus"
                            onClick={() =>
                              handleUpdateCart(item.productId._id, 1)
                            }
                          >
                            <i className="fa fa-plus" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="align-middle">
                      {item.productId.price * item.quantity} VND
                    </td>
                    <td className="align-middle">
                      <button
                        className="btn btn-sm btn-primary"
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
          <div className="col-lg-4">
            {/* <form className="mb-5" action="">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control p-4"
                  placeholder="Coupon Code"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary">Apply Coupon</button>
                </div>
              </div>
            </form> */}
            <div className="card border-secondary mb-5">
              <div className="card-header bg-secondary border-0">
                <h4 className="font-weight-semi-bold m-0">Cart Summary</h4>
              </div>
              {/* <div className="card-body">
                <div className="d-flex justify-content-between mb-3 pt-1">
                  <h6 className="font-weight-medium">Subtotal</h6>
                  <h6 className="font-weight-medium">$150</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">$10</h6>
                </div>
              </div> */}
              <div className="card-footer border-secondary bg-transparent">
                <div className="d-flex justify-content-between mt-2">
                  <h5 className="font-weight-bold">Total</h5>
                  <h5 className="font-weight-bold">{totalAmount.toFixed()} VND</h5>
                </div>
                <Link to={`/checkout`} className="btn btn-block btn-primary my-3 py-3" >
                  Proceed To Checkout
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
