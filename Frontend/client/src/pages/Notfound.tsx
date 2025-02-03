import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="container text-center mt-5">
            <div className="content">
                <h1 className="display-1 text-danger">404 NOT FOUND</h1>
                <img src="../../image/gif/gif/error.gif" alt="" width={480} />
                <div className="text">
                    <h2>Look like you're lost</h2>
                    <p>The page you are looking for not available</p>
                    <Link to={"/"} className="w-25 btn btn-primary">
                        Go To Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
