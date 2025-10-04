import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { menus } from '@/routes';

const { Sider } = Layout;

const LeftSidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="demo-logo-vertical" />
      <Menu
        onClick={({ keyPath }) => {
          console.log('🚀 ~ file: LeftSidebar.tsx ~ keyPath:', keyPath);
          navigate(`${keyPath[0]}`);
        }}
        theme="dark"
        mode="inline"
        items={menus}
      />
    </Sider>
  );
};

export default LeftSidebar;
