import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="text-center m-5">
        <h1 className="big-error">404 NOT FOUND</h1> {/* Added class "big-error" */}
        <img src="../../image/gif/gif/error.gif" width={500} alt="Error" />
        <div>
          <h2>Có vẻ bạn đã nhầm trang</h2>
          <p>Trang bạn tìm kiếm không tồn tại</p>
          <Link to={"/"} className="btn btn-primary">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
