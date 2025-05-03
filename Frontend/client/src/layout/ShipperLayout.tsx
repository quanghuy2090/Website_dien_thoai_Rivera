import React from "react";
import Shipper from "../components/Shipper"; // Import component Shipper
import { Outlet } from "react-router-dom"; // Để render các route con

const ShipperLayout = () => {
  return (
    <div>
      {/* Sidebar + Header của shipper */}
      <Shipper />

      {/* Nội dung động sẽ được render tại đây */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ShipperLayout;
