import React, { useEffect, useState } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "antd";
import {
    MailOutlined, GoogleOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const { user } = useSelector((state) => ({ ...state }));
    let dispatch = useDispatch();

    useEffect(() => {
        if (user && user.token) {
            nav('/')
        }
    }, [user, nav])

    // useEffect(() => {
    //     setEmail(window.localStorage.getItem('emailRegister'));
    // }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (!email || !password) {
            toast.error('Vui lòng điền email và mật khẩu');
            return;
        };
        if (password.length < 6) {
            toast.error('Mật khẩu phải từ 6 ký tự trở lên');
            return;
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            if (result.user.emailVerified) {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();
                toast.success("Đăng nhập thành công. Chuyển hướng sang trang chủ");
                console.log(idTokenResult);

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
                        console.log("Create or update");
                    })
                    .catch();

                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                        email: user.email,
                        token: idTokenResult.token,
                    }
                });
                setTimeout(() => {
                    nav('/');
                }, 2000);
            }

        }
        catch (error) {
            console.log(error);
            toast.error(error.message);
            setLoading(false)
        }
    };

    const googleLogin = () => {
        signInWithPopup(auth, googleAuthProvider)
            .then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();
                toast.success("Đăng nhập thành công. Chuyển hướng sang trang chủ")

                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: {
                        email: user.email,
                        token: idTokenResult.token,
                    }
                })
                // if (result.user.emailVerified) {
                //     let user = auth.currentUser;
                //     await user.updatePassword(password);
                //     const idTokenResult = await user.getIdTokenResult();    
                //     console.log(idTokenResult);
                // }
                setTimeout(() => {
                    nav('/');
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);

            })
    }

    const loginform = () => (<form onSubmit={handleSubmit}>
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
        <Button onClick={handleSubmit}
            type="primary"
            className="m-2"
            block
            shape="round"
            icon={<MailOutlined />}
            size="large"
            disabled={!email || password.length < 6}
        >Login with Email & Password</Button>
    </form>)

    return (
        <div className="conatiner p-5" style={{ display: "block" }}>
            <div className="row ">
                <div className="col-md-6 offset-md-3">
                    {loading ? <h4>Loading...</h4> : <h4>Login</h4>}
                    {loginform()}
                    <Button onClick={googleLogin}
                        type="primary"
                        danger
                        className="m-2"
                        block
                        shape="round"
                        icon={<GoogleOutlined />}
                        size="large"
                    >
                        Login with Google
                    </Button>
                    <Link
                        to={'/forgot/password'}
                        className="float-end text-danger text-decoration-none mt-2"
                    >
                        Forgot Password ?
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login