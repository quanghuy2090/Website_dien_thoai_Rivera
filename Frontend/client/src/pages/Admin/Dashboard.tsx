import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions,
} from "chart.js";
import { getStatistics, OrderStatus } from "../../services/statistics";
import { RevenueData, TopUser, TopProduct } from "../../services/statistics";
import { formatCurrency } from "../../utils/formatCurrency";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<{
    totalRevenue: RevenueData[];
    topUsers: TopUser[];
    topProducts: TopProduct[];
    leastSoldProducts: TopProduct[];
    orderStatus: OrderStatus[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        console.log("API Response:", data);

        const formattedData = {
          totalRevenue: Array.isArray(data.totalRevenue?.data)
            ? data.totalRevenue.data
            : [],
          topUsers: Array.isArray(data.topUsers?.data)
            ? data.topUsers.data
            : [],
          topProducts: Array.isArray(data.topProducts?.data)
            ? data.topProducts.data
            : [],
          leastSoldProducts: Array.isArray(data.leastSoldProducts?.data)
            ? data.leastSoldProducts.data
            : [],
          orderStatus: Array.isArray(data.orderStatus?.data)
            ? data.orderStatus.data
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
    return <div className="text-center my-5">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center my-5 text-danger">{error}</div>;
  }

  if (!statistics) {
    return null;
  }

  // Tính toán các giá trị tổng quan
  const totalRevenue = statistics.totalRevenue.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );
  const totalUsers = statistics.topUsers.length;

  // Dữ liệu cho biểu đồ cột (Doanh thu theo tháng)
  const barChartData = {
    labels: statistics.totalRevenue
      .sort((a, b) => {
        const dateA = new Date(a._id.year, a._id.month - 1);
        const dateB = new Date(b._id.year, b._id.month - 1);
        return dateA.getTime() - dateB.getTime();
      })
      .map((item) => `${item._id.month}/${item._id.year}`),
    datasets: [
      {
        label: "Doanh thu",
        data: statistics.totalRevenue
          .sort((a, b) => {
            const dateA = new Date(a._id.year, a._id.month - 1);
            const dateB = new Date(b._id.year, b._id.month - 1);
            return dateA.getTime() - dateB.getTime();
          })
          .map((item) => item.totalRevenue),
        backgroundColor: "#3498db",
        borderColor: "#3498db",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = context.parsed.y;
            return `Doanh thu: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          // text: "Thời gian (Tháng/Năm)",
          font: {
            size: 14,
            weight: "bold",
          },
          padding: 10,
        },
        ticks: {
          font: {
            size: 12,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        title: {
          display: true,
          text: "Doanh thu (VND)",
          font: {
            size: 14,
            weight: "bold",
          },
          padding: 10,
        },
        ticks: {
          callback: (value: number) => formatCurrency(value),
          font: {
            size: 12,
          },
          padding: 10,
        },
        beginAtZero: true,
      },
    },
  };
  const pieChartData = {
    labels: statistics.orderStatus.map((item) => item.status),
    datasets: [
      {
        label: "Trạng thái đơn hàng",
        data: statistics.orderStatus.map((item) => item.totalOrders),
        backgroundColor: statistics.orderStatus.map((item) => {
          switch (item.status) {
            case "Chưa xác nhận":
              return "#b2bec3"; // xám nhạt
            case "Đã xác nhận":
              return "#74b9ff"; // xanh dương nhạt
            case "Đang giao hàng":
              return "#f39c12"; // vàng cam
            case "Đã giao hàng":
              return "#2ecc71"; // xanh lá
            case "Đã nhận hàng":
              return "#1abc9c"; // xanh ngọc
            case "Hoàn thành":
              return "#27ae60"; // xanh đậm
            case "Đã hủy":
              return "#e74c3c"; // đỏ
            default:
              return "#dfe6e9"; // fallback xám nhạt
          }
        }),
        borderColor: statistics.orderStatus.map((item) => {
          switch (item.status) {
            case "Chưa xác nhận":
              return "#636e72";
            case "Đã xác nhận":
              return "#0984e3";
            case "Đang giao hàng":
              return "#e67e22";
            case "Đã giao hàng":
              return "#27ae60";
            case "Đã nhận hàng":
              return "#16a085";
            case "Hoàn thành":
              return "#1e8449";
            case "Đã hủy":
              return "#c0392b";
            default:
              return "#b2bec3";
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const label = context.label || "";
            const value = context.raw as number;
            const percentage =
              statistics.orderStatus[context.dataIndex]?.percentage || "0%";
            return `${label}: ${value} (${percentage})`;
          },
        },
      },
    },
  };

  return (
    <div className="content p-4">
      <div className="row mb-4">
        {/* Thẻ "Doanh Thu Tổng" với gradient hồng */}
        <div className="col-md-6 col-lg-4 mb-3">
          <div
            className="card h-100 shadow border-0"
            style={{
              background: "linear-gradient(135deg, #ff9a9e, #fad0c4)", // Gradient hồng
              color: "#fff",
              borderRadius: "10px",
            }}
          >
            <div className="card-body text-center">
              <h5 className="card-title" style={{ fontWeight: "bold" }}>
                Doanh Thu Tổng
              </h5>
              <p className="card-text fs-3 fw-bold">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Thẻ "Tổng Khách Hàng" với gradient xanh dương */}
        <div className="col-md-6 col-lg-4 mb-3">
          <div
            className="card h-100 shadow border-0"
            style={{
              background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)", // Gradient xanh dương
              color: "#fff",
              borderRadius: "10px",
            }}
          >
            <div className="card-body text-center">
              <h5 className="card-title" style={{ fontWeight: "bold" }}>
                Tổng Khách Hàng
              </h5>
              <p className="card-text fs-3 fw-bold">{totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        {/* Biểu đồ cột - Doanh Thu Theo Tháng */}
        <div className="col-md-8 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h5 className="card-title">Doanh Thu Theo Tháng</h5>
              {statistics.totalRevenue.length > 0 ? (
                <div style={{ height: "400px" }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              ) : (
                <p>Không có dữ liệu doanh thu để hiển thị.</p>
              )}
            </div>
          </div>
        </div>

        {/* Biểu đồ tròn - Thống Kê Trạng Thái Đơn Hàng */}
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h5 className="card-title">Thống Kê Trạng Thái Đơn Hàng</h5>
              {statistics.orderStatus.length > 0 ? (
                <div style={{ height: "400px" }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              ) : (
                <p>Không có dữ liệu trạng thái đơn hàng để hiển thị.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Top sản phẩm bán chạy và bán ít nhất trên cùng một hàng */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h5 className="card-title">Top 5 Sản Phẩm Bán Chạy Nhất</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng bán</th>
                      <th>Doanh thu (VND)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.topProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.totalQuantity}</td>
                        <td>{formatCurrency(product.totalRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h5 className="card-title">Top 5 Sản Phẩm Bán Ít Nhất</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng bán</th>
                      <th>Doanh thu (VND)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.leastSoldProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.totalQuantity}</td>
                        <td>{formatCurrency(product.totalRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top khách hàng trên một hàng riêng */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body">
              <h5 className="card-title">Top 5 Khách Hàng Mua Nhiều Nhất</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Số đơn hàng</th>
                      <th>Tổng chi tiêu (VND)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.topUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.totalOrders}</td>
                        <td>{formatCurrency(user.totalSpent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
