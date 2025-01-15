import React, { useState } from "react";
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
                Home
            </Item>

            <Item key="register" icon={<UserAddOutlined />} className="float-end">
                Register
            </Item>

            <Item key="login" icon={<UserOutlined />} className="float-end">
                Login
            </Item>

            <SubMenu icon={<SettingOutlined />} title="Username">
                <Item key="setting:1">Option 1</Item>
                <Item key="setting:2">Option 2</Item>
            </SubMenu>

        </Menu>
    );
};

export default Header;
