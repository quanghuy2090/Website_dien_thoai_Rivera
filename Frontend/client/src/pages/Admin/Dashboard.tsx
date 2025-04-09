import React, { useEffect, useState } from "react";
import { getStatistics } from "../../services/statistics";
import { TopUser, TopProduct } from "../../services/statistics";
import { formatCurrency } from "../../utils/formatCurrency";
import "./Dashboard.css";

const Dashboard = () => {
  const [statistics, setStatistics] = useState<{
    totalRevenue: number;
    topUsers: TopUser[];
    topProducts: TopProduct[];
    leastSoldProducts: TopProduct[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        console.log("API Response:", data);

        // Xử lý dữ liệu từ API response
        const formattedData = {
          totalRevenue: data.totalRevenue?.data?.totalRevenue || 0,
          topUsers: Array.isArray(data.topUsers?.data)
            ? data.topUsers.data
            : [],
          topProducts: Array.isArray(data.topProducts?.data)
            ? data.topProducts.data
            : [],
          leastSoldProducts: Array.isArray(data.leastSoldProducts?.data)
            ? data.leastSoldProducts.data
            : [],
        };

        console.log("Formatted Data:", formattedData);
        setStatistics(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Không thể tải dữ liệu thống kê");
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="content">
      <h1 className="h3 mb-4 fw-bold text-primary d-flex align-items-center">
        <i className="fas fa-chart-line me-2"></i> Thống kê
      </h1>
      <p className="mb-4 text-secondary">
        Đây là trang thống kê tổng quan về hoạt động của cửa hàng.
      </p>

      <div className="table-container">
        <div className="row g-4">
          {/* Tổng doanh thu */}
          <div className="col-md-4">
            <div className="stat-card total-revenue">
              <div className="stat-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="stat-info">
                <h3>Tổng doanh thu</h3>
                <p>{formatCurrency(statistics.totalRevenue)}</p>
              </div>
            </div>
          </div>

          {/* Top khách hàng */}
          <div className="col-md-8">
            <div className="stat-card">
              <h3 className="card-title">Top 5 khách hàng mua nhiều nhất</h3>
              <div className="customer-list">
                {statistics.topUsers?.map((user, index) => (
                  <div key={user._id} className="customer-item">
                    <div className="customer-rank">{index + 1}</div>
                    <div className="customer-info">
                      <h4>{user.userName}</h4>
                      <p>{user.email}</p>
                    </div>
                    <div className="customer-stats">
                      <div className="stat">
                        <span className="label">Số đơn</span>
                        <span className="value">{user.totalOrders}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Tổng chi</span>
                        <span className="value">
                          {formatCurrency(user.totalSpent)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top sản phẩm bán chạy */}
          <div className="col-md-6">
            <div className="stat-card">
              <h3 className="card-title">Top 5 sản phẩm bán chạy nhất</h3>
              <div className="product-chart">
                {statistics.topProducts?.map((product, index) => (
                  <div key={product._id} className="product-bar">
                    <div className="product-info">
                      <span className="product-rank-best">{index + 1}.</span>
                      <span className="product-name">{product.name}</span>
                      <span className="product-quantity">
                        {product.totalQuantity} sản phẩm
                      </span>
                    </div>
                    <div className="product-revenue">
                      {formatCurrency(product.totalRevenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top sản phẩm bán ít */}
          <div className="col-md-6">
            <div className="stat-card">
              <h3 className="card-title">Top 5 sản phẩm bán ít nhất</h3>
              <div className="product-chart">
                {statistics.leastSoldProducts?.map((product, index) => (
                  <div key={product._id} className="product-bar">
                    <div className="product-info">
                      <span className="product-rank-least">{index + 1}.</span>
                      <span className="product-name">{product.name}</span>
                      <span className="product-quantity">
                        {product.totalQuantity} sản phẩm
                      </span>
                    </div>
                    <div className="product-revenue">
                      {formatCurrency(product.totalRevenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
