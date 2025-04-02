"use client";

import React, { useState } from 'react';
import { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Button } from 'antd';
// import { DefaultMenuList } from './menu/DefaultMenuList';

const { Sider } = Layout;

const Sidebar: React.FC<MenuProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    console.log('toggle collapsed');
    setCollapsed(!collapsed);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = e => {
    console.log('click ', e);
    navigate(`/${e.key}`);
  };

  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
    backgroundColor: colorBgContainer,
  };

  return (
    <div>
      <Sider
        collapsed={collapsed}
        width={250}
        className="flex flex-col shadow-sm"
        style={siderStyle}
      >
        <div className="mt-4 mb-0 text-center">
          <h3 className="text-lg font-bold">Chain Tracking App</h3>
        </div>
        <Menu
          inlineCollapsed={collapsed}
          onClick={onClick}
          className="flex-grow py-2 text-xs"
          color={colorBgContainer}
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1', 'sub2']}
          style={{ borderRight: 0 }}
          // items={DefaultMenuList(collapsed)}
        />
        <div className="absolute bottom-0 w-full p-2">
          <Button className="w-full" type="default" onClick={toggleCollapsed}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
      </Sider>
    </div>
  );
};

export default Sidebar;
