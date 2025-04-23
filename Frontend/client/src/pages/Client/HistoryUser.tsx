import React, { useEffect, useState } from "react";
import {
  getAllOrder,
  Order,
  updateStatusCustomerOrder,
} from "../../services/order";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import "../../css/HistoryUser.css";

type UpdateInfo = {
  status: "Đã nhận hàng" | "Đã hủy";
  cancellationReason: string;
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
  const [orderUser, setOrderUser] = useState<Order[]>([]);
  const [updates, setUpdates] = useState<Record<string, UpdateInfo>>({});
  const [searchParams] = useSearchParams();

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
          fetchOrder(user._id);
        }
      } catch (error) {
        console.error("Lỗi khi parse user data:", error);
      }
    }
  }, [searchParams]);

  const fetchOrder = async (userId: string) => {
    try {
      const { data } = await getAllOrder();
      const filteredOrders = data.orders.filter(
        (order: Order) => order.userId.toString() === userId
      );
      setOrderUser(filteredOrders);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Lỗi khi tải đơn hàng"
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Lỗi khi tải đơn hàng");
      }
    }
  };

  const formatPrice = (price: number) => {
    return price
      ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND"
      : "0 VND";
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: "Đã nhận hàng" | "Đã hủy",
    cancellationReason: string
  ) => {
    try {
      const { data } = await updateStatusCustomerOrder(
        orderId,
        newStatus,
        cancellationReason
      );
      toast.success(data.message);
      fetchOrder(userId!);
      setUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[orderId];
        return newUpdates;
      });
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Cập nhật trạng thái thất bại!"
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Cập nhật trạng thái thất bại!");
      }
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
          <div className="history-container">
            {orderUser.map((order) => (
              <div key={order._id} className="order-card">
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
                  {order.items.map((item, idx) => (
                    <div key={idx} className="product-item">
                      <img
                        src={item.productId.images?.[0] || "/placeholder.png"}
                        alt={item.productId.name}
                        className="product-image"
                      />
                      <div className="product-details">
                        <div className="product-name">
                          {item.productId.name}
                        </div>
                        {item.variantId &&
                          typeof item.variantId === "object" && (
                            <div className="product-variant">
                              (
                              {
                                (
                                  item.variantId as {
                                    ram: string;
                                    storage: string;
                                  }
                                ).ram
                              }
                              /
                              {
                                (
                                  item.variantId as {
                                    ram: string;
                                    storage: string;
                                  }
                                ).storage
                              }
                              )
                            </div>
                          )}
                        <div className="product-quantity">
                          Số lượng: {item.quantity}
                        </div>
                      </div>
                      <div className="product-price">
                        {formatPrice(item.salePrice || item.price)}
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
                                cancellationReason:
                                  prev[order.orderId]?.cancellationReason || "",
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
                            value={
                              updates[order.orderId]?.cancellationReason || ""
                            }
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
                                ? updates[order.orderId].cancellationReason
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
        </div>
      </div>
    </>
  );
};

export default HistoryUser;
