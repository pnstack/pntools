import React from 'react';
import { Layout } from 'antd';

const { Sider } = Layout;

interface RightSidebarProps {
  visible?: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ visible = false }) => {
  if (!visible) {
    return null;
  }

  return (
    <Sider
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderLeft: '1px solid #f0f0f0',
      }}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Additional Info</h3>
        <p className="text-sm text-gray-600">
          Right sidebar for additional tools and information
        </p>
      </div>
    </Sider>
  );
};

export default RightSidebar;
