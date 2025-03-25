import React, { useEffect, useState } from "react";
import { getAllOrder, Order, updateStatusOrder } from "../../services/order";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

type UpdateInfo = {
  status: Order["status"];
  cancellationReason: string;
};

const HistoryUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [orderUser, setOrderUser] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<string | null>(null); // để track dropdown sản phẩm
  // Lưu thông tin cập nhật cho mỗi đơn hàng theo orderId
  const [updates, setUpdates] = useState<Record<string, UpdateInfo>>({});

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
      console.error("Error fetching orders:", error);
    }
  };

  const formatPrice = (price: number) => {
    return price
      ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
      : "0 VND";
  };

  // Hàm cập nhật trạng thái đơn hàng
  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"],
    cancellationReason: string
  ) => {
    try {
      await updateStatusOrder(orderId, newStatus, cancellationReason);
      toast.success("Cập nhật trạng thái thành công!");
      // Làm mới danh sách đơn hàng sau khi cập nhật
      fetchOrder(userId!);
      // Xóa thông tin cập nhật sau khi thành công nếu cần
      setUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[orderId];
        return newUpdates;
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Cập nhật trạng thái thất bại, vui lòng thử lại!");
    }
  };

  const toggleDropdown = (orderId: string) => {
    setActiveOrder(activeOrder === orderId ? null : orderId);
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
                <th scope="col">Cập nhật trạng thái</th>
                <th scope="col">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="history-body">
              {orderUser.map((order) => (
                <tr key={order._id}>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
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
                  <td>{order.status}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    {/* Phần cập nhật luôn hiển thị dropdown cùng với input lý do nếu chọn Hủy */}
                    <select
                      className="form-select"
                      value={updates[order.orderId]?.status || ""}
                      onChange={(e) => {
                        const selected = e.target.value as Order["status"];
                        setUpdates((prev) => ({
                          ...prev,
                          [order.orderId]: {
                            status: selected,
                            cancellationReason:
                              prev[order.orderId]?.cancellationReason || "",
                          },
                        }));
                      }}
                    >
                      <option value="" disabled>
                        Chọn cập nhật
                      </option>
                      <option value="Đã nhận hàng">Đã nhận hàng</option>
                      <option value="Đã huỷ">Hủy</option>
                    </select>
                    {updates[order.orderId]?.status === "Đã huỷ" && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Nhập lý do hủy đơn"
                        value={updates[order.orderId]?.cancellationReason || ""}
                        onChange={(e) =>
                          setUpdates((prev) => ({
                            ...prev,
                            [order.orderId]: {
                              ...prev[order.orderId],
                              cancellationReason: e.target.value,
                            },
                          }))
                        }
                      />
                    )}
                    <button
                      className="btn btn-success mt-2"
                      onClick={() => {
                        if (
                          !updates[order.orderId] ||
                          !updates[order.orderId].status
                        ) {
                          alert("Chọn cập nhật trạng thái!");
                          return;
                        }
                        handleStatusChange(
                          order.orderId,
                          updates[order.orderId].status,
                          updates[order.orderId].status === "Đã huỷ"
                            ? updates[order.orderId].cancellationReason
                            : ""
                        );
                      }}
                    >
                      Gửi
                    </button>
                  </td>
                  <td>
                    <Link
                      to={`/bill/${order.orderId}`}
                      className="fa fa-eye btn"
                    />
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
