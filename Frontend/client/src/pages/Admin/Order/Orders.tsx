import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useAdminOrderPolling } from "../../../hooks/useAdminOrderPolling";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { orders, loading } = useAdminOrderPolling();

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderId
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="content">
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Danh sách đơn hàng</h5>
            <span className="text-primary">Bảng / Đơn hàng</span>
          </div>

          <div className="d-flex gap-2 mb-3">
            <div className="input-group" style={{ width: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo mã đơn hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ width: "200px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chưa xác nhận">Chưa xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đang giao hàng">Đang giao hàng</option>
              <option value="Đã giao hàng">Đã giao hàng</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Mã đơn hàng</th>
                  <th scope="col">Khách hàng</th>
                  <th scope="col">Tổng tiền</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Phương thức thanh toán</th>
                  <th scope="col">Ngày tạo</th>
                  <th scope="col" className="text-center">
                    Tùy chọn
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.userName}</td>
                    <td>{order.totalAmount.toLocaleString("vi-VN")}đ</td>
                    <td>
                      <span
                        className={`badge bg-${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.paymentMethod}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="text-center">
                      <Link
                        to={`/admin/order/${order.orderId}`}
                        className="btn btn-sm btn-info"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Chưa xác nhận":
      return "warning";
    case "Đã xác nhận":
      return "primary";
    case "Đang giao hàng":
      return "info";
    case "Đã giao hàng":
      return "success";
    case "Hoàn thành":
      return "success";
    case "Đã hủy":
      return "danger";
    default:
      return "secondary";
  }
};

export default Orders;
