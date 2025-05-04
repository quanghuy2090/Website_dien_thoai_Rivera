import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getOrderById,
  Order,
  OrderItem,
  updateOrderStatusByCustomer,
} from "../../services/order";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";
import "../../css/Bill.css";
import { useOrderPolling } from "../../hooks/useOrderPolling";

type UpdateInfo = {
  status: "Đã nhận hàng" | "Đã hủy";
  cancelReason: string;
};

const Bill = () => {
  const { id } = useParams<{ id: string }>();
  const [updates, setUpdates] = useState<Record<string, UpdateInfo>>({});
  const { order, error } = useOrderPolling(id);

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

  if (error) {
    return (
      <div className="bill-page error">Không thể tải đơn hàng: {error}</div>
    );
  }

  if (!order) {
    return <div className="bill-page loading">Đang tải...</div>;
  }

  return (
    <div className="bill-page">
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
                <li>
                  <a href="/history">Lịch sử đơn hàng</a>
                </li>
                <li className="active">Chi tiết đơn hàng</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="bill-container">
            <div className="bill-header">
              <h1>Hóa đơn đơn hàng #{order.orderId}</h1>
              <div className="bill-info">
                <div className="info-row">
                  <span className="label">Ngày đặt hàng:</span>
                  <span className="value">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Trạng thái:</span>
                  <span
                    className={`value status ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Phương thức thanh toán:</span>
                  <span className="value">{order.paymentMethod}</span>
                </div>
                <div className="info-row">
                  <span className="label">Trạng thái thanh toán:</span>
                  <span className="value">{order.paymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="bill-content">
              <div className="shipping-info">
                <h2>Thông tin giao hàng</h2>
                <div className="info-details">
                  <p>
                    <strong>Người nhận:</strong>{" "}
                    {order.shippingAddress.userName}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {order.shippingAddress.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {order.shippingAddress.street},{" "}
                    {order.shippingAddress.ward},{" "}
                    {order.shippingAddress.district},{" "}
                    {order.shippingAddress.city}
                  </p>
                </div>
              </div>

              <div className="order-items">
                <h2>Chi tiết đơn hàng</h2>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Màu sắc</th>
                      <th>Dung lượng</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: OrderItem, index: number) => (
                      <tr key={index}>
                        <td>
                          <div className="product-info">
                            <img
                              src={item.productImage || "/placeholder.png"}
                              alt={item.productName}
                              className="product-image"
                            />
                            <span>{item.productName}</span>
                          </div>
                        </td>
                        <td>{item.color}</td>
                        <td>{item.capacity}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.salePrice)}</td>
                        <td>
                          {formatCurrency(item.salePrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-summary">
                <h2>Tổng cộng</h2>
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="label">Tổng tiền hàng:</span>
                    <span className="value">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span className="label">Tổng thanh toán:</span>
                    <span className="value">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {canUpdateStatus(order) && (
                <div className="status-update-section">
                  <h2>Cập nhật trạng thái</h2>
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

              {order.cancelReason && (
                <div className="cancel-info">
                  <h2>Thông tin hủy đơn</h2>
                  <div className="cancel-details">
                    {order.cancelHistory && order.cancelHistory.length > 0 && (
                      <div className="cancel-history">
                        {order.cancelHistory.map((history, index) => (
                          <div key={index} className="history-item">
                            <p>
                              <strong>Thời gian:</strong>{" "}
                              {new Date(history.cancelledAt).toLocaleString()}
                            </p>
                            <p>
                              <strong>Lý do:</strong> {history.cancelReason}
                            </p>
                            <p>
                              <strong>Người hủy:</strong> {history.cancelledBy}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bill-footer">
              <button className="print-button" onClick={() => window.print()}>
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
