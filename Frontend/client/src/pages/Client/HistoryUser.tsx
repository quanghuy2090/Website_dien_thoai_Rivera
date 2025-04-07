import React, { useEffect, useState } from "react";
import {
  getAllOrder,
  Order,
  updateStatusCustomerOrder,
} from "../../services/order";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./HistoryUser.css";

type UpdateInfo = {
  status: "Đã nhận hàng" | "Đã hủy";
  cancellationReason: string;
};

const HistoryUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [orderUser, setOrderUser] = useState<Order[]>([]);
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
      const filteredOrders = data.orders.filter(
        (order: Order) => order.userId.toString() === userId
      );
      setOrderUser(filteredOrders);
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Lỗi khi tải đơn hàng"
        );
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
      console.error("Lỗi cập nhật trạng thái:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Cập nhật trạng thái thất bại!"
        );
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
        <div className="container history">
          <table className="table table-bordered text-center mb-0">
            <thead className="bg-secondary text-dark">
              <tr>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Trạng thái đơn hàng</th>
                <th scope="col">Phương thức thanh toán</th>
                <th scope="col">Ngày đặt</th>
                <th scope="col">Trạng thái thanh toán</th>
                <th scope="col">Cập nhật trạng thái</th>
                <th scope="col">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="history-body">
              {orderUser.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div className="product-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="product-item">
                          <span className="product-name">
                            {item.productId.name}
                          </span>
                          {item.variantId &&
                            typeof item.variantId === "object" && (
                              <span className="product-variant">
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
                              </span>
                            )}
                          <span> x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{formatPrice(order.totalAmount)}</td>
                  <td>{order.status}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.paymentStatus}</td>
                  <td>
                    {canUpdateStatus(order) && (
                      <>
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
                            className="form-control mt-2"
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
                              updates[order.orderId].status === "Đã hủy"
                                ? updates[order.orderId].cancellationReason
                                : ""
                            );
                          }}
                        >
                          Gửi
                        </button>
                      </>
                    )}
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
