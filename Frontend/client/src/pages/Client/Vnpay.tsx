import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState("");
    const [transactionNo, setTransactionNo] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const orderIdFromParams = searchParams.get("orderId");
        const transactionNoFromParams = searchParams.get("transactionNo");

        if (orderIdFromParams) setOrderId(orderIdFromParams);
        if (transactionNoFromParams) setTransactionNo(transactionNoFromParams);

        setLoading(false);
    }, [searchParams]);

    if (loading) {
        return <p className="text-center text-secondary fs-5">Đang xử lí...</p>;
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow-lg p-4 text-center">
                <div className="text-success display-4">
                    <i className="bi bi-check-circle-fill"></i>
                </div>
                <h1 className="mt-3 text-dark">Thanh toán thành công!</h1>
                <p className="text-muted">Cảm ơn bạn đã mua hàng. Dưới đây là thông tin thanh toán:</p>

                <div className="alert alert-secondary mt-3">
                    <p className="mb-1"><strong>Mã đơn hàng:</strong> {orderId}</p>
                    <p className="mb-0"><strong>Mã giao dịch VNPay:</strong> {transactionNo}</p>
                </div>

                <div className="mt-4 d-flex gap-3 justify-content-center">
                    <button className="btn btn-outline-primary" onClick={() => navigate("/")}>
                        Quay lại trang chủ
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate(`/bill`)}>
                        Xem đơn hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
