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
          <h2>Look like you're lost</h2>
          <p>The page you are looking for is not available</p>
          <Link to={"/"} className="btn btn-primary">
            Go To Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
