import React, { useEffect, useState } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
            handleCodeInApp: true,
        };

        await sendPasswordResetEmail(auth, email, config)
        .then(()=>{
            setEmail('');
            setLoading(false);
            toast.success('Vui lòng vào hòm thư để tiếp tục đổi mật khẩu')
        })
        .catch((err)=> {
            console.log(err);
            toast.error(err.message);
            setLoading(false);
        })
    }

    return (
        <>
            <div className="container col-md-6 offset-md-3 p-5">
                {loading ? <h4>Loading...</h4> : <h4>Forgot Password</h4>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="form-control m-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Vui lòng nhập email của bạn"
                        autoFocus
                    />
                    <button className="btn shadow m-2 " disabled={!email}>Confirm</button>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword