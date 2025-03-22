import React, { useEffect, useState } from "react";
import { getAllOrder, Order, updateStatusOrder } from "../../services/order";
import { Link } from "react-router-dom";

const HistoryUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [orderUser, setOrderUser] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<string | null>(null); // to track the clicked order for dropdown

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          setUserId(user._id);
          fetchOrder(user._id);
        }
      } catch (error) {
        console.error("Lỗi khi parse user data:", error);
      }
    }
  }, []);

  const fetchOrder = async (userId: string) => {
    try {
      const { data } = await getAllOrder();
      setOrderUser(data.orders);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const formatPrice = (price: number) => {
    return price
      ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
      : "0 VND";
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await updateStatusOrder(
        orderId,
        newStatus,
        newStatus === "Đã huỷ" ? "Lý do hủy" : ""
      );
      alert("Cập nhật trạng thái thành công!");
      fetchOrder(userId!);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Cập nhật trạng thái thất bại, vui lòng thử lại!");
    }
  };

  const toggleDropdown = (orderId: string) => {
    setActiveOrder(activeOrder === orderId ? null : orderId); // Toggle the active order for dropdown
  };

  return (
    <>
      <div id="breadcrumb" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="breadcrumb-tree">
                <li>
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <a href="/profile">Tài khoản</a>
                </li>
                <li className="active">Lịch sử đơn hàng</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container history">
          <table className="table table-bordered text-center mb-0">
            <thead className="bg-secondary text-dark">
              <tr>
                <th scope="col">Ngày đặt</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Trạng thái đơn hàng</th>
                <th scope="col">Phương thức thanh toán</th>
                <th scope="col">Trạng thái thanh toán</th>
                <th scope="col">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="history-body">
              {orderUser.map((order, idx) => (
                <tr key={idx}>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {/* Show product name and quantity in a single row */}
                    <div
                      className="product-list"
                      onClick={() => toggleDropdown(order._id)}
                    >
                      {order.items.map((cart, idx) => (
                        <span key={idx} className="product-item">
                          {cart.productId.name}/
                        </span>
                      ))}
                    </div>

                    {/* Dropdown list for product details */}
                    {activeOrder === order._id && (
                      <ul className="product-dropdown">
                        {order.items.map((cart, idx) => (
                          <li key={idx}>
                            <div>
                              <strong>{cart.productId.name}</strong> (x{" "}
                              {cart.quantity})
                            </div>
                            <div>
                              <img
                                src={cart.productId.images[0]}
                                alt={cart.productId.name}
                                width={50}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>
                    <select
                      className="form-select"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.orderId,
                          e.target.value as Order["status"]
                        )
                      }
                    >
                      <option value="Chưa xác nhận" disabled>
                        Chưa xác nhận
                      </option>
                      <option value="Đã xác nhận" disabled>
                        Đã xác nhận
                      </option>
                      <option value="Đang giao hàng" disabled>
                        Đang giao hàng
                      </option>
                      <option value="Đã giao hàng" disabled>
                        Đã giao hàng
                      </option>
                      <option value="Đã nhận hàng">Đã nhận hàng</option>
                      <option value="Đã huỷ">Hủy</option>
                    </select>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    <Link to={`/bill/${order.orderId}`} className="fa fa-eye btn"></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HistoryUser;
