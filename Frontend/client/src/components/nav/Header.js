import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
    UserOutlined, UserAddOutlined, AppstoreOutlined, SettingOutlined, LogoutOutlined
} from "@ant-design/icons";
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { SubMenu, Item } = Menu;

const Header = () => {
    const [current, setCurrent] = useState("home");
    let dispatch = useDispatch();
    let nav = useNavigate();
    let { user } = useSelector((state) => ({ ...state }))

    const handleClick = (e) => {
        setCurrent(e.key);
    };

    const logout = () => {
        signOut(auth);
        dispatch({
            type: 'LOGOUT',
            payload: null,
        });
        nav('/login')
    }

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{ display: "block" }}>
            <Item key="home" icon={<AppstoreOutlined />}>
                <Link to={'/'} className="text-decoration-none">Home</Link>
            </Item>
            {!user && (
                <>
                    <Item key="register" icon={<UserAddOutlined />} className="float-end">
                        <Link to={'/register'} className="text-decoration-none">Register</Link>
                    </Item>

                    <Item key="login" icon={<UserOutlined />} className="float-end">
                        <Link to={'/login'} className="text-decoration-none">Login</Link>
                    </Item>
                </>
            )}

            {user && (
                <SubMenu icon={<SettingOutlined />} 
                title={user.email && user.email.split('@')[0]} //chia ten trong email
                className="float-end">
                    <Item key="setting:1">Option 1</Item>
                    <Item key="setting:2">Option 2</Item>
                    <Item key="logout" icon={<LogoutOutlined />} onClick={logout}>Logout</Item>
                </SubMenu>
            )}

        </Menu>
    );
};

export default Header;
