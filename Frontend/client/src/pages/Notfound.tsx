import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="container text-center mt-5">
            <div className="content">
                <h1>404</h1>
                <img src="../../image/gif/gif/error.gif" alt="" />
                <div className="text">
                    <h2>Look like you're lost</h2>
                    <p>the page you are looking for not available</p>
                    <Link to={"/"} >
                        Go To Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
