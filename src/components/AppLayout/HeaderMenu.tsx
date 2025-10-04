import React from 'react';
import { Avatar, Col, Layout, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';

const { Header } = Layout;

const HeaderMenu: React.FC = () => {
  return (
    <Header className="flex h-12 w-full items-start justify-center border-b-[1px] border-stone-500 bg-white px-1">
      <Row className="flex h-full w-full items-center justify-between">
        <Col span={8} className="flex items-center justify-center">
          <Search placeholder="Search" enterButton />
        </Col>
        <Col className="flex items-center justify-center">
          <div className="flex flex-row items-center justify-center space-x-2">
            <p className="text-xl font-bold capitalize text-gray-700">Nguyen</p>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderMenu;
