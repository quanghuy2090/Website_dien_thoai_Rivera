import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import {
    UserOutlined, UserAddOutlined, AppstoreOutlined, SettingOutlined
} from "@ant-design/icons";

const { SubMenu, Item } = Menu;

const Header = () => {
    const [current, setCurrent] = useState("home");

    const handleClick = (e) => {
        setCurrent(e.key);
    };

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{ display: "block" }}>
            <Item key="home" icon={<AppstoreOutlined />}>
                <Link to={'/'} className="text-decoration-none">Home</Link>
            </Item>

            <Item key="register" icon={<UserAddOutlined />} className="float-end">
                <Link to={'/register'} className="text-decoration-none">Register</Link>
            </Item>

            <Item key="login" icon={<UserOutlined />} className="float-end">
                <Link to={'/login'} className="text-decoration-none">Login</Link>
            </Item>

            <SubMenu icon={<SettingOutlined />} title="Username">
                <Item key="setting:1">Option 1</Item>
                <Item key="setting:2">Option 2</Item>
            </SubMenu>

        </Menu>
    );
};

export default Header;
