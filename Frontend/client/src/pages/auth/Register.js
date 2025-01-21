import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();
    let dispatch = useDispatch();

    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        if (user && user.token) {
            nav('/')
        }
    }, [user, nav])

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailRegister'));
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Vui lòng điền email và mật khẩu');
            return;
        };
        if (password.length < 6) {
            toast.error('Mật khẩu phải từ 6 ký tự trở lên');
            return;
        }

        try {
            const config = {
                url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
                handleCodeInApp: true,
            };
            const result = await createUserWithEmailAndPassword(auth, email, password, config);
            const user = result.user
            await sendEmailVerification(user);
            toast.success("Email xác thực đã được gửi. Chuyển hướng sang trang chu");
            setEmail('');
            setPassword('');
            setTimeout(() => {
                nav('/');
            }, 2000);
            if (result.user.emailVerified) {
                let user = auth.currentUser;
                const idTokenResult = await user.getIdTokenResult();
                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: "LOGGED_IN_USER",
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            },
                        });
                        console.log();
                    })
                    .catch();
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const completeRegisterform = () => (<form onSubmit={handleSubmit}>
        <div className="form-group">
            <input
                type="email"
                className="form-control m-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Vui lòng nhập email của bạn"
                autoFocus
            />
        </div>
        <div className="form-group">
            <input
                type="password"
                className="form-control m-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Vui lòng nhập mật khẩu"
            />
        </div>
        <button type="submit" className="btn shadow m-2">Register</button>
    </form>)

    return (
        <div className="conatiner p-5" >
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register </h4>
                    {completeRegisterform()}
                </div>
            </div>
        </div>
    )
}

export default Register