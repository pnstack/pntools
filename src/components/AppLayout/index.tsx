import React, { PropsWithChildren, useState } from 'react';
import { Layout } from 'antd';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import HeaderMenu from './HeaderMenu';

const { Content } = Layout;

const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [showRightSidebar] = useState(false);

  return (
    <Layout hasSider>
      <LeftSidebar />
      <Layout className="flex h-screen bg-gray-300" style={{ marginLeft: 200 }}>
        <HeaderMenu />
        <Content className="bg-slate-300 text-start">
          <div className="h-full flex-1 justify-start overflow-auto bg-white px-2 py-3">
            {children}
          </div>
        </Content>
      </Layout>
      <RightSidebar visible={showRightSidebar} />
    </Layout>
  );
};

export default AppLayout;
