import React, { useEffect, useState } from "react";
import {
  getAllOrder,
  Order,
  updateOrderStatusByCustomer,
  IShippingAddress,
  OrderItem,
} from "../../services/order";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import "../../css/HistoryUser.css";
import { useOrderPolling } from "../../hooks/useOrderPolling";

type UpdateInfo = {
  status: "Đã nhận hàng" | "Đã hủy";
  cancelReason: string;
};

const getStatusClass = (status: Order["status"]) => {
  switch (status) {
    case "Chưa xác nhận":
      return "status-pending";
    case "Đã xác nhận":
      return "status-confirmed";
    case "Đang giao hàng":
      return "status-shipping";
    case "Đã giao hàng":
      return "status-delivered";
    case "Hoàn thành":
      return "status-completed";
    case "Đã hủy":
      return "status-cancelled";
    default:
      return "";
  }
};

const HistoryUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Record<string, UpdateInfo>>({});
  const [searchParams] = useSearchParams();
  const { orders, error } = useOrderPolling();

  useEffect(() => {
    // Xử lý thông báo từ URL parameters
    const success = searchParams.get("success");
    const message = searchParams.get("message");

    if (success === "true" && message) {
      toast.success(decodeURIComponent(message));
    } else if (success === "false" && message) {
      toast.error(decodeURIComponent(message));
    }

    window.scrollTo(0, 0);
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          setUserId(user._id);
        }
      } catch (error) {
        console.error("Lỗi khi parse user data:", error);
      }
    }
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return price
      ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
      : "0 VND";
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: "Đã nhận hàng" | "Đã hủy",
    cancelReason: string
  ) => {
    try {
      const { data } = await updateOrderStatusByCustomer(
        orderId,
        newStatus,
        cancelReason
      );
      toast.success(data.message);
      setUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[orderId];
        return newUpdates;
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại!"
      );
    }
  };

  const canUpdateStatus = (order: Order) => {
    if (order.status === "Đã giao hàng") {
      return true; // Có thể cập nhật thành "Đã nhận hàng"
    }
    if (order.status === "Chưa xác nhận") {
      return true; // Có thể cập nhật thành "Đã hủy"
    }
    return false;
  };

  // Filter orders for current user
  const userOrders = orders.filter(
    (order: Order) => order.userId.toString() === userId?.toString()
  );

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
        <div className="container">
          {userOrders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">
                <i className="fa fa-shopping-cart"></i>
              </div>
              <h3>Chưa có đơn hàng nào được đặt</h3>
              <p>Bạn chưa có đơn hàng nào trong lịch sử mua hàng.</p>
              <Link to="/" className="btn btn-primary">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="history-container">
              {userOrders.map((order) => (
                <div key={order.orderId} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Đơn hàng #{order.orderId}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`order-status ${getStatusClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-info">
                    <div className="info-group">
                      <span className="info-label">Phương thức thanh toán</span>
                      <span className="info-value">{order.paymentMethod}</span>
                    </div>
                    <div className="info-group">
                      <span className="info-label">Trạng thái thanh toán</span>
                      <span className="info-value">{order.paymentStatus}</span>
                    </div>
                  </div>

                  <div className="order-products">
                    {order.items.map((item: OrderItem, idx: number) => (
                      <div key={idx} className="product-item">
                        <img
                          src={item.productImage || "/placeholder.png"}
                          alt={item.productName || "Sản phẩm"}
                          className="product-image"
                        />
                        <div className="product-details">
                          <div className="product-name">
                            {item.productName || "Sản phẩm không xác định"}
                          </div>
                          <div className="product-variant">
                            ({item.color || "Không xác định"} /{" "}
                            {item.capacity || "Không xác định"})
                          </div>
                          <div className="product-quantity">
                            Số lượng: {item.quantity || 0}
                          </div>
                        </div>
                        <div className="product-price">
                          {formatPrice(item.salePrice || 0)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <span className="total-label">Tổng tiền:</span>
                    <span className="total-value">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  <div className="order-actions">
                    <div className="action-left">
                      <Link
                        to={`/bill/${order.orderId}`}
                        className="action-button view-details"
                      >
                        <i className="fa fa-eye mr-2 me-2"></i>
                        Xem chi tiết
                      </Link>
                    </div>

                    {canUpdateStatus(order) && (
                      <div className="action-right">
                        <div className="status-form">
                          <select
                            className="form-select"
                            value={updates[order.orderId]?.status || ""}
                            onChange={(e) => {
                              const selected = e.target.value as
                                | "Đã nhận hàng"
                                | "Đã hủy";
                              setUpdates((prev) => ({
                                ...prev,
                                [order.orderId]: {
                                  status: selected,
                                  cancelReason:
                                    prev[order.orderId]?.cancelReason || "",
                                },
                              }));
                            }}
                          >
                            <option value="" disabled>
                              Chọn cập nhật
                            </option>
                            {order.status === "Đã giao hàng" && (
                              <option value="Đã nhận hàng">Đã nhận hàng</option>
                            )}
                            {order.status === "Chưa xác nhận" && (
                              <option value="Đã hủy">Hủy</option>
                            )}
                          </select>
                          {updates[order.orderId]?.status === "Đã hủy" && (
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nhập lý do hủy đơn"
                              value={updates[order.orderId]?.cancelReason || ""}
                              onChange={(e) =>
                                setUpdates((prev) => ({
                                  ...prev,
                                  [order.orderId]: {
                                    ...prev[order.orderId],
                                    cancelReason: e.target.value,
                                  },
                                }))
                              }
                            />
                          )}
                          <button
                            className={`action-button ${
                              updates[order.orderId]?.status === "Đã hủy"
                                ? "cancel-order"
                                : "update-status"
                            }`}
                            onClick={() => {
                              if (
                                !updates[order.orderId] ||
                                !updates[order.orderId].status
                              ) {
                                toast.error("Vui lòng chọn trạng thái!");
                                return;
                              }
                              handleStatusChange(
                                order.orderId,
                                updates[order.orderId].status,
                                updates[order.orderId].status === "Đã hủy"
                                  ? updates[order.orderId].cancelReason
                                  : ""
                              );
                            }}
                          >
                            {updates[order.orderId]?.status === "Đã hủy"
                              ? "Hủy đơn hàng"
                              : "Cập nhật"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryUser;
